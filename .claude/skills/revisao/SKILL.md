---
name: revisao
description: Como funciona o painel /revisao do Dark Film — registrar pedidos que chegam pelo WhatsApp, responder "já ajustei", ler as filas e testar sem sujar o registro. Use sempre que o cliente mandar um pedido, quando terminar de implementar algo que ele pediu, ou antes de mexer em content/revisao.ts, lib/revisao.ts ou app/api/revisao.
---

# O painel `/revisao`

Ferramenta de aprovação entre a **WB Digital Solutions** (agência) e a **The Dark Film** (cliente).
O cliente abre cada página do site, diz se está certa ou escreve o que quer mudar. Tudo fica
gravado com data, hora, autor e IP.

`https://thedarkfilm.wbdigitalsolutions.com/revisao` — sem login, o endereço é o acesso.

## A regra que resolve 90% dos casos

**Implementar o pedido e responder no painel são duas coisas diferentes, e é a segunda que o
cliente vê.** Já aconteceu de o trabalho estar feito havia um dia e o item continuar marcado como
pendência nossa, porque ninguém registrou a resposta.

**Ao fim de toda rodada, confira que a fila da agência está vazia.** É o cheque que pega isso:

```bash
curl -s https://thedarkfilm.wbdigitalsolutions.com/api/revisao | python3 -c "
import sys,json
ev=json.load(sys.stdin); ev=ev.get('eventos',ev)
LADO={'Bruno The Dark Film':'cliente','Michele The Dark Film':'cliente','Bruno WB Digital Solutions':'agencia'}
def sit(e):
    outro='com-agencia' if LADO[e['autor']]=='cliente' else 'com-cliente'
    return {'confirmado':'fechado','aprovado':'aprovado','ajustado':'com-cliente','desfeito':'com-cliente'}.get(e['acao'],outro)
m={}
for e in sorted(ev,key=lambda x:x['em']):
    if e.get('secaoId'): m[f\"{e['paginaId']}/{e['secaoId']}\"]=sit(e)
print('precisa de nós:', [k for k,v in m.items() if v=='com-agencia'] or 'nada')"
```

## O fluxo normal

O cliente manda pelo WhatsApp — é o canal dele e não dá para obrigá-lo a usar outro. O combinado:

1. **Transcrever** o pedido dele no painel, com a data e a hora reais em que ele mandou
2. **Implementar**
3. **Registrar o "já ajustei"**, explicando o que foi feito e o que ficou diferente do pedido
4. Ele só precisa **aprovar**

Passos 1 e 3 usam o script de importação, nunca a API pública.

## Registrar (o script)

```bash
cd app
# ver os ids de página e seção disponíveis
node --env-file=.env.local scripts/importar-revisao.mjs --listar

# um evento
node --env-file=.env.local scripts/importar-revisao.mjs \
  --pagina home --secao na-oficina --acao alteracao \
  --autor "Bruno The Dark Film" --data 2026-09-02 \
  --texto "Trocar a foto da oficina, está antiga."

# vários (preferir isto — texto longo no shell é sofrimento)
node --env-file=.env.local scripts/importar-revisao.mjs --lote /tmp/lote.json
```

`lote.json` é uma lista de objetos:

```json
[
  { "pagina": "galeria", "secao": "envelopamento", "acao": "ajustado",
    "autor": "Bruno WB Digital Solutions", "origem": "interno",
    "texto": "A área voltou com 10 itens..." }
]
```

Campos: `pagina`, `secao`, `acao`, `autor`, `texto`, `data` (opcional, `AAAA-MM-DD` = meio-dia de
Brasília), `origem` (`whatsapp` padrão, ou `interno`), `por` (quem transcreveu).

`--env-file=.env.local` é obrigatório: o script escreve direto no bucket R2 com as quatro variáveis
`R2_*`. Até 16/09/2026 era o Vercel Blob; ver **Onde está cada coisa**.

### Por que não pela API pública

A API carimba **sempre** o agora e o IP de quem clicou, de propósito. Se aceitasse data e origem
arbitrárias, qualquer pessoa com a URL forjaria histórico e o registro deixaria de provar nada.
Importação é ato de bastidor. No lugar do IP vai `WhatsApp` ou `Registro interno`, e o evento
nunca finge ter vindo do painel.

## O modelo

**Autores** (exatamente estas strings): `Bruno The Dark Film`, `Michele The Dark Film` (cliente) ·
`Bruno WB Digital Solutions` (agência).

**Ações** e para quem a bola vai:

| Ação | Quem usa | Depois fica |
| --- | --- | --- |
| `alteracao` | cliente pede mudança | com a agência |
| `resposta` | qualquer lado responde | com o outro lado |
| `criado` | abre assunto avulso | com o outro lado |
| `ajustado` | agência diz "já fiz" | **com o cliente** |
| `aprovado` | cliente aprova | aprovado |
| `desfeito` | cliente desfaz a aprovação | com o cliente |
| `confirmado` | agência agradece e fecha | fechado |

`alteracao`, `resposta` e `criado` exigem texto; as outras não.

Estado de cada item = **último evento vence**. Nada de somar ou interpretar histórico.

### `__pagina`

Além das seções nomeadas, cada página tem um item `__pagina`: a conversa sobre a página inteira,
usada quando o pedido não é de nenhuma seção ou quando a seção citada deixou de existir.

Aprovar uma página grava **um evento por seção, mais o `__pagina`** — não um evento coletivo.
Custa arquivos e paga na auditoria. (Até 04/09/2026 o `__pagina` ficava de fora e travava o
cliente: a página dizia "8 de 8 aprovadas" e continuava pendente, sem botão que resolvesse.)

## Onde está cada coisa

O registro mora no **Cloudflare R2**, não mais no Vercel Blob. A migração foi em 16/09/2026,
depois de a cota gratuita do Blob estourar e sete stores da conta ficarem suspensas por 30 dias.
A causa não foi escrita: era **leitura**. `lerEventos` fazia um `list` mais um `get` por evento —
52 operações por visita ao painel, e um timer de polling de 30 s teria queimado 2.880 por dia num
teto de 2.000 por mês, válido para a conta inteira. Duas lições que valem para qualquer
armazenamento novo aqui: **o consolidado existe para a leitura custar 1 operação, não N**, e
**não coloque timer de polling no painel** (só monta e `visibilitychange`).


| Arquivo | O quê |
| --- | --- |
| `app/content/revisao.ts` | as 55 páginas e suas seções — **é isto que adapta a ferramenta para outro projeto** |
| `app/lib/revisao.ts` | tipos, `LADO`, `situacaoApos`, `reduzir`, leitura/escrita |
| `app/lib/r2.ts` | assinatura S3 do R2 (`aws4fetch`), `r2Ler`, `r2Gravar` |
| `app/app/api/revisao/route.ts` | POST do painel; carimba IP e agora |
| `app/components/revisao/` | `PainelRevisao.tsx`, `ui.tsx`, `Conversa.tsx` |
| `app/scripts/importar-revisao.mjs` | registro de bastidor |
| Bucket R2 | `revisao/eventos/<id>.json` (um por evento) + `revisao/registro.json` (consolidado) |

### Duas regras de ouro

**Nunca renomeie um `id` de página ou seção que já esteja em uso.** O histórico está amarrado a
ele. Mudar o `titulo` é livre; mudar o `id` desconecta a conversa. Antes de repor um id que já
existiu, confira que não há evento gravado contra ele.

**Nunca escreva "você" nos rótulos.** O painel tem seletor de autor no topo, então "Precisa de
você" muda de significado conforme quem está lendo — e fica ao lado de colunas que nomeiam os
lados. Já confundiu o cliente três vezes. Nomeie sempre: `Esperando The Dark Film` (sem artigo,
o nome já traz o "The") e `Esperando a WB`.

## A armadilha do id que não existe

**Antes de registrar, confira que a página e a seção existem em `content/revisao.ts`.** O script
aceita qualquer `--pagina` e qualquer `--secao`: não valida contra o conteúdo. O painel, ao
contrário, renderiza só as páginas declaradas ali. Registrar contra um id inexistente grava o
evento de verdade, e ele fica **invisível para o cliente** — some sem erro nenhum.

Foi o que aconteceu em 12/09/2026: o pedido dele sobre o simulador foi para `simulador/__pagina`,
mas o id da página é `legislacao` (href `/simulador`), e o simulador completo mora em
`peliculas-automotivas/simule-a-sua-pelicula`. O pedido ficou cinco dias sem aparecer no painel.

O cheque, antes de escrever:

```bash
cd app && node --env-file=.env.local scripts/importar-revisao.mjs --listar | grep -i <assunto>
```

E depois de escrever, o detector de órfãos:

```bash
cd app && node --experimental-strip-types -e "
import { paginasRevisao as P } from './content/revisao.ts';
const ev = (await (await fetch('https://thedarkfilm.wbdigitalsolutions.com/api/revisao')).json()).eventos;
const m = new Map(P.map(p => [p.id, new Set(['__pagina', ...p.secoes.map(s => s.id)])]));
const orf = ev.filter(e => !m.has(e.paginaId) || !m.get(e.paginaId).has(e.secaoId));
console.log('orfaos:', orf.map(e => e.paginaId + '/' + e.secaoId));"
```

Cuidado com o nome: o export é `paginasRevisao`, não `PAGINAS`.

Órfão não se apaga — re-registre o pedido no lugar certo, com a **data original**, e deixe um
`ajustado` no órfão dizendo para onde a conversa foi.

## O registro é append-only de verdade

O script não sobrescreve evento já gravado. O consolidado é derivado: some os eventos e ele se
refaz a partir dos arquivos individuais.

Não existe caminho oficial para corrigir uma mensagem já publicada. Em 04/09/2026 foi preciso
`allowOverwrite: true` num script solto, com decisão do Bruno, para consertar uma frase
contraditória. Isso está aberto na issue `cmtmqzabl00eplr015njsjy5u`. **Enquanto não houver
decisão, corrigir é gesto excepcional e exige perguntar antes.**

Melhor: revisar o texto antes de gravar. Um evento com erro de fato é pior do que um evento a menos.

## Testar sem sujar o registro

Testar no ar escreve no mesmo bucket de produção. A ordem segura:

1. **Retrato dos ids atuais** — `curl .../api/revisao`, salvar a lista
2. **Criar um evento, apagar, conferir que voltou ao número original** — validar o apagador antes
   de confiar nele
3. Só então o teste completo
4. Apagar **por id**. O `--zerar` foi removido do script justamente porque apagava a história inteira
5. Conferir: mesmo total antes e depois, nenhum original perdido

O script de limpeza é temporário — escrever, usar, apagar. Não deixar no repositório.

**O rodapé do painel diz ao cliente "Nada é apagado".** Vale para o registro dele, mas o token do
R2 permite apagar. Se essa página um dia precisar valer como prova, a frase e o poder de apagar
precisam ser reconciliados.

## Escrevendo para o cliente

Ele lê no celular, entre um carro e outro. O que funciona:

- **Diga o que mudou e o número.** "A área passou de 3 para 11 fotos" vale mais que "atualizamos".
- **Admita o que ficou diferente do pedido, e por quê.** Se 9 das 10 fotos ainda são de 2013,
  diga. Ele descobrir sozinho custa mais caro que a gente contar.
- **Peça o que falta junto com o motivo.** "Manda vídeo de envelopamento" é cobrança; "os seis que
  você mandou são 478x850, pequenos demais para um card" é explicação.
- **Não use jargão.** "Endereço provisório" e não "subdomínio de staging".
- **Releia procurando contradição.** Uma mensagem que abre com "não sobrou nada de 2013" e três
  parágrafos depois diz "nove são de 2013" já foi publicada uma vez.

## Deploy

Mudança em `content/revisao.ts` ou nos componentes exige build e deploy — é código.
Evento gravado pelo script aparece na hora, sem deploy: está no R2, não no bundle.

Deploy é manual: `cd app && vercel --prod --yes`.
