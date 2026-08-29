# Domínio, DNS e e-mail — levantamento e plano de migração

Levantamento feito em **29/08/2026** sobre `thedarkfilm.com.br`, para decidir como apontar o
domínio para o site novo sem derrubar o e-mail do cliente.

Tudo aqui foi obtido de fontes públicas (WHOIS, DNS e banners de serviço). **Nenhum teste de login
ou credencial foi feito.** Os comandos usados estão na seção "Como refazer" no fim — dá para
reconferir tudo em poucos minutos quando for retomar.

Documentos relacionados: [`BASELINE-E-METAS.md`](./BASELINE-E-METAS.md) (medição do site antigo).

---

## 1. Domínio — quem é o dono

Fonte: `whois thedarkfilm.com.br` (Registro.br), consultado em 29/08/2026.

| Campo | Valor |
| --- | --- |
| Domínio | `thedarkfilm.com.br` |
| Titular | **The Dark Film Comercio e Distribuicao Ltda ME** |
| CNPJ | 03.860.081/0001-98 |
| Responsável | Bruno Beck |
| Registrado em | 21/06/2000 |
| Última alteração | 22/06/2024 |
| **Expira em** | **21/06/2027** |
| Status | `published` (ativo) |

**O domínio está no CNPJ da própria empresa.** Não está em nome de agência, funcionário nem do
provedor. Essa é a situação boa: não depende de terceiro para transferir ou mudar qualquer coisa.

### Contatos registrados

| Papel | Handle | Pessoa | E-mail | Handle atualizado em |
| --- | --- | --- | --- | --- |
| Titular / administrativo | `DIB56` | BRUNO BECK | `thedarkfilm@thedarkfilm.com.br` | 20/02/2014 |
| **Técnico** | `HCJ` | Helio Coelho Jr. | `heliocoelhojr@gmail.com` | 11/10/2022 |

O contato técnico **não é da empresa**: Helio Coelho Jr. é o responsável pela **Compuland
Informática Ltda ME** (CNPJ 00.554.257/0001-95), o provedor que hospeda site, DNS e e-mail.

### Quem pode fazer o quê no Registro.br

Confirmado na documentação do Registro.br em 29/08/2026:

- **Contato técnico** — pode alterar os servidores DNS. É o suficiente para a migração.
- **Contato administrativo** — pode alterar DNS e trocar os contatos técnico e de cobrança.
- **Titular** — necessário para transferência de titularidade (não é o nosso caso).

> Fonte: <https://registro.br/ajuda/gerenciamento-de-conta/> e
> <https://registro.br/ajuda/gerenciamento-de-conta/alterar-servidores-dns/>

**Consequência prática:** basta o cliente designar a WB Digital Solutions como **contato técnico**.
Não precisa mexer em titularidade.

### Só existe UM contato técnico por domínio

Verificado no WHOIS: o campo `tech-c` é único, nunca repete. Amostra de 29/08/2026:

```
globo.com.br      owner-c: CLKED1   tech-c: CTG6
uol.com.br        owner-c: CAU12    tech-c: CTU6
compuland.com.br  owner-c: HCJ      tech-c: HCJ
```

Ou seja, **não dá para ter a WB e a Compuland como técnicos ao mesmo tempo** — designar a WB
substitui o Helio nesse papel.

**Isso não afeta o e-mail.** O `tech-c` governa uma coisa só: quem pode trocar os nameservers no
nível do registro. Não é credencial de acesso ao servidor da Compuland. O e-mail continua
funcionando porque o MX aponta para o servidor deles e o cliente paga a caixa lá — nada disso passa
pelo Registro.br. Eles seguem administrando as contas normalmente.

O que eles perdem é poder trocar a delegação de DNS por conta própria, que é exatamente o objetivo:
o fornecedor que está sendo substituído não deve controlar o apontamento no dia da virada.

**Em troca, o MX passa a ser responsabilidade nossa.** Se a Compuland trocar o servidor ou o IP do
e-mail, não vão conseguir corrigir sozinhos. Avisar por escrito na virada (ver seção 6).

**O handle não precisa ser pessoa física.** O da Globo (`CTG6`) é `person: Contato` — handle de
equipe. Dá para criar no CNPJ da WB Digital Solutions em vez do CPF, e não amarrar o domínio de um
cliente a uma pessoa.

---

## 2. DNS atual — a zona inteira

Nameservers: `rd.compuland.com.br` e `nd.compuland.com.br` (ambos da Compuland).
SOA: `rd.compuland.com.br. helio.compuland.com.br. 2015011900 ...` — **serial de janeiro de 2015**,
ou seja, a zona não é editada há mais de dez anos.

| Registro | TTL | Valor |
| --- | --- | --- |
| `thedarkfilm.com.br` A | — | **NÃO EXISTE** |
| `www` CNAME | 3600 | `www6.compuland.com.br` → 200.194.160.28 |
| `MX 10` | 3600 | `fuzzy4.compuland.com.br` → 200.194.160.44 |
| `TXT` (SPF) | 3600 | `v=spf1 a mx a:sv.compuland.com.br a:www6.compuland.com.br a:fuzzy3.compuland.com.br -all` |

Não foram encontrados os subdomínios comuns (`mail`, `webmail`, `smtp`, `pop`, `imap`, `ftp`,
`cpanel`, `painel`, `loja`, `blog`). Transferência de zona (AXFR) está corretamente negada, então
**não dá para garantir que a lista acima é exaustiva** — quando tivermos acesso ao painel, conferir.

### Achado: o domínio sem `www` está morto

O apex `thedarkfilm.com.br` não tem registro A nenhum (resposta `NOERROR` com `ANSWER: 0`).
Na prática:

```
http://thedarkfilm.com.br/       → não conecta (curl retorna 000)
http://www.thedarkfilm.com.br/   → 200 OK
```

Quem digita o domínio sem `www` — que é o que a maioria das pessoas faz — não chega a lugar nenhum.
Isso se resolve sozinho quando a zona for para a Vercel/Cloudflare com apex e `www` apontados.

### Atenção ao SPF

O SPF termina em `-all` (**hard fail**). Se a zona nova subir sem ele — ou sem os três `a:` —
os e-mails que o cliente envia passam a ser **rejeitados** por quem valida SPF. Tem que ser copiado
literalmente.

---

## 3. Hospedagem — Compuland

Todos os hosts estão dentro do bloco **200.194.160.0/20**, registrado no CNPJ da Compuland
(00.554.257/0001-95), com Helio Coelho Jr. como responsável e como contato de abuse. É
infraestrutura própria do provedor, não revenda de nuvem.

| Host | IP | Papel |
| --- | --- | --- |
| `www6.compuland.com.br` | 200.194.160.28 | site do cliente |
| `fuzzy4.compuland.com.br` | 200.194.160.44 | MX (recebe e-mail) |
| `sv.compuland.com.br` | 200.194.160.21 | SMTP/IMAP (envia e lê) |
| `fuzzy3.compuland.com.br` | 200.194.160.14 | saída autorizada no SPF |

### A própria Compuland também não tem HTTPS

Verificado em 29/08/2026. O Chrome mostra "Não seguro" no site deles, igual ao do cliente.
O caminho completo:

| URL | Resultado |
| --- | --- |
| `https://compuland.com.br` | TLS falha — protocolo obsoleto e certificado não confiável |
| `https://www.compuland.com.br` | 200, mas é um stub de 284 bytes com `<meta http-equiv="refresh" url=http://www.compuland.com.br>` — **devolve o visitante para o HTTP** |
| `http://www.compuland.com.br` | 301 → `http://sv.compuland.com.br` |
| `http://compuland.com.br` | o site de verdade: **Apache 2.0.61 (2007) + PHP 5.2.6 (2008)**, só HTTP |

Existe um certificado Let's Encrypt válido (emitido 11/07/2026, vence 09/10/2026), mas cobre apenas
o nome `www.compuland.com.br` e não entrega conteúdo — HTTPS montado pela metade e nunca terminado.

A home deles tem um bloco "Notícias no mundo — Fonte: BBC News" que carrega vazio: widget de RSS
quebrado, provavelmente porque o feed da BBC hoje exige HTTPS e o PHP 5.2.6 não consegue buscar.

> **Erro corrigido:** a primeira versão deste documento dizia que a Compuland tinha HTTPS
> funcionando. Era um mal-entendido meu — o endpoint moderno que encontrei é só o stub de redirect.

**Uso na venda:** dá para mostrar o aviso "Não seguro" do site do cliente e o do provedor lado a
lado, na reunião, sem explicar nada técnico.

### A empresa está ativa

Consulta ao CNPJ (Receita Federal via BrasilAPI, 29/08/2026):

- **COMPULAND INFORMATICA LTDA** — CNPJ 00.554.257/0001-95
- Situação cadastral **ATIVA** desde 22/06/2022; atividade iniciada em 11/04/1995
- Petrópolis/RJ, microempresa, CNAE *Provedores de acesso às redes de comunicações*

Sinais técnicos de operação recente: domínio renovado em 25/01/2026 (vence 09/02/2027), certificado
Let's Encrypt renovado automaticamente em julho/2026, DNS e servidor de e-mail respondendo.

É um provedor de banda larga pequeno em que hospedagem é negócio secundário — não uma empresa
abandonada. O que está parado é a infraestrutura de hospedagem, não a empresa.

---

## 4. E-mail — quem hospeda e em quê

**É a própria Compuland que vende o e-mail**, em servidor próprio. Não é Google Workspace
(seria `aspmx.l.google.com`), não é Microsoft 365 (`*.mail.protection.outlook.com`) nem Zoho
(`mx.zoho.com`).

Software identificado pelos banners:

| Serviço | Banner / versão | Idade |
| --- | --- | --- |
| SMTP | `220 sv.compuland.com.br ESMTP Postfix` (limite de 50 MB/mensagem) | — |
| IMAP | `Courier-IMAP ready. Copyright 1998-2008` | linha parada em **2008** |
| Webmail | **RainLoop** em `https://fuzzy3.compuland.com.br/` — PHP 7.2.31, **HTTPS com certificado válido** (DigiCert/RapidSSL, 02/04/2026 → 17/10/2026) | — |

> **Erro corrigido (29/08/2026):** uma versão anterior deste documento dizia que o webmail não tinha
> HTTPS. Errado. `webmail.compuland.com.br` é a **página do portal** do provedor (HTTP, Apache 2.0.61),
> não o webmail — ela só contém o link "Acessar meus emails", que aponta para `fuzzy3` com HTTPS
> válido. **Não usar "o webmail dele é inseguro" como argumento de venda: é falso e verificável.**

### Achado sério: o envio de e-mail não tem criptografia disponível

Testadas as três portas de envio em `sv.compuland.com.br`:

| Porta | Resultado |
| --- | --- |
| 25 | `AUTH PLAIN` anunciado, **sem STARTTLS** |
| 587 (submissão) | `AUTH PLAIN` anunciado, **sem STARTTLS** |
| 465 (SMTPS) | conexão **recusada** |

Não existe caminho cifrado para enviar e-mail por esse servidor. Quem usa **um programa de e-mail**
(Outlook, app do celular configurado por SMTP) manda usuário e senha em texto puro pela rede.

**Mas isso só vale se o cliente usar programa de e-mail.** Se ele usa só o webmail (RainLoop, com
HTTPS válido), a senha dele vai cifrada e o problema não o atinge. **Descobrir como ele usa antes de
levantar o assunto** — pergunta simples: "você entra num site pra ver seu e-mail, ou usa um programa
no celular/computador?"

A leitura por IMAP está coberta: a porta 143 anuncia `STARTTLS`.

Conclusão para a venda: **não vender a migração pela segurança.** O argumento é condicional e, se o
cliente perguntar à Compuland, o certificado do webmail desmente a parte visível. Ângulos honestos e
que costumam doer de verdade: volume de spam recebido, e-mail do cliente caindo em spam (testável —
mandar da conta dele para um Gmail e ver onde cai), experiência no celular, e a consolidação de
fornecedor depois que o site sair da Compuland.

---

## 5. Riscos e decisões

**O e-mail do contato administrativo mora no servidor que queremos trocar.** A recuperação de senha
do Registro.br vai para `thedarkfilm@thedarkfilm.com.br`, caixa hospedada na Compuland. Se o e-mail
cair no meio da migração, o cliente perde o canal de recuperação da conta do domínio no mesmo
instante. Por isso: **a zona nova tem que estar montada e conferida ANTES de trocar o NS, nunca
depois.**

**Ser contato técnico dá acesso a uma coisa só.** São dois caminhos diferentes:

| Caminho | Dá para fazer como contato técnico? |
| --- | --- |
| Trocar os NS no Registro.br (leva a zona inteira para outro DNS) | ✅ sim |
| Editar só o A/CNAME mantendo os NS da Compuland (painel do provedor) | ❌ não — é senha da Compuland |

Ou seja: o caminho disponível é **levar a zona embora**, e aí tudo que existe hoje precisa ser
recriado no DNS novo.

**Decisão tomada:** migrar **só o site** nesta fase. O MX e o SPF são copiados como estão e o e-mail
continua na Compuland. Um problema de cada vez. A migração do e-mail fica como segunda venda.

---

## 6. Plano de migração (checklist)

- [ ] Criar handle da WB Digital Solutions no Registro.br (preferir CNPJ a CPF, ver seção 1)
- [ ] Cliente designa a WB como **contato técnico** — isso *substitui* a Compuland no papel;
      não afeta o e-mail deles (ver seção 1)
- [ ] Confirmar com o cliente que ele tem o **login do Registro.br** em mãos, antes de qualquer troca
- [ ] Pedir ao cliente/Compuland a lista completa de registros da zona (o AXFR é negado; a tabela da
      seção 2 pode não ser exaustiva) — atenção a subdomínios e a qualquer coisa de e-mail
- [ ] Montar a zona no Cloudflare **antes de trocar qualquer coisa**:
  - [ ] `MX 10 fuzzy4.compuland.com.br`
  - [ ] `TXT` SPF **literal**: `v=spf1 a mx a:sv.compuland.com.br a:www6.compuland.com.br a:fuzzy3.compuland.com.br -all`
  - [ ] apex → Vercel
  - [ ] `www` → Vercel
- [ ] Combinar janela com o cliente (a propagação de troca de NS é mais lenta que a de registro comum
      — não fazer no meio de um dia de movimento)
- [ ] Trocar os NS no Registro.br para os da Cloudflare
- [ ] Depois de propagar: **testar o e-mail do cliente enviando E recebendo** antes de dar por encerrado
- [ ] Avisar a Compuland por escrito: o DNS passou a ser administrado por nós, o MX segue apontado
      para `fuzzy4.compuland.com.br` e o SPF foi mantido igual — qualquer mudança de servidor ou IP
      do e-mail, precisam nos avisar para atualizarmos
- [ ] Conferir apex e `www` respondendo em HTTPS
- [ ] Refazer as medições do [`BASELINE-E-METAS.md`](./BASELINE-E-METAS.md) e preencher a coluna "depois"

### Pendências para perguntar ao cliente

- O handle administrativo `DIB56` está com dados atualizados pela última vez em **2014**. O telefone
  e o e-mail ali ainda são dele? É por ali que se recupera a conta um dia.
- Para a proposta de migração de e-mail: **quantas contas** existem e **qual o volume** guardado?
- Existe algum outro serviço no domínio que a gente não viu (loja, sistema interno, algum subdomínio)?

---

## 7. Como refazer o levantamento

```bash
D=thedarkfilm.com.br

# Domínio: titularidade e contatos
whois $D | sed -n '/^domain:/,$p'

# Zona: o que existe hoje
dig +noall +answer $D A            # hoje: vazio (apex sem A)
dig +noall +answer www.$D A
dig +noall +answer $D MX
dig +noall +answer $D TXT
dig +short $D NS

# O apex responde?
curl -s -o /dev/null -w "apex: %{http_code}\n" -m 10 http://$D/
curl -s -o /dev/null -w "www:  %{http_code}\n" -m 10 http://www.$D/

# Dono do IP / do bloco
whois 200.194.160.28 | grep -iE "^(inetnum|owner|ownerid|responsible|abuse-c):"
```

```bash
# Banners dos serviços de e-mail.
# ATENÇÃO: macOS não tem `timeout`. Usar os timeouts do próprio nc: -w (conexão) e -G (handshake).

# SMTP: capacidades (procurar por STARTTLS — hoje NÃO aparece)
( printf 'EHLO teste.wbdigitalsolutions.com\r\n'; sleep 3; printf 'QUIT\r\n'; sleep 1 ) \
  | nc -w 8 -G 6 sv.compuland.com.br 25 | tr -d '\r'

# Mesma coisa na submissão
( printf 'EHLO teste.wbdigitalsolutions.com\r\n'; sleep 3; printf 'QUIT\r\n'; sleep 1 ) \
  | nc -w 8 -G 6 sv.compuland.com.br 587 | tr -d '\r'

# SMTPS (hoje: connection refused)
echo | openssl s_client -connect sv.compuland.com.br:465 -brief

# IMAP: banner com versão e capacidades
( sleep 2 ) | nc -w 5 -G 4 sv.compuland.com.br 143 | head -1

# Webmail: versão do servidor
curl -s -m 12 -D- -o /dev/null http://webmail.compuland.com.br/ | grep -iE "^(HTTP|server|x-powered-by)"
```

```bash
# HTTPS da Compuland: seguir a cadeia inteira, não testar só uma URL
for u in http://compuland.com.br/ https://compuland.com.br/ \
         http://www.compuland.com.br/ https://www.compuland.com.br/ \
         http://sv.compuland.com.br/; do
  echo -n "$u → "; curl -s -o /dev/null -m 12 -w "code=%{http_code} redir=%{redirect_url}\n" "$u"
done

# o "site" em https://www é um stub de redirect — olhar o conteúdo, não só o código HTTP
curl -s -m 15 https://www.compuland.com.br/

# situação do CNPJ na Receita
curl -s https://brasilapi.com.br/api/cnpj/v1/00554257000195 | python3 -m json.tool | head -30
```

Só leitura de banner público — nada aqui tenta autenticar.
