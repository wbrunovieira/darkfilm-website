# The Dark Film & Sound — site novo

Refazer, do zero, o site da **The Dark Film & Sound** (Petrópolis/RJ), em Next.js + Tailwind.

O site atual é de ~2013, roda em PHP 5.3, **não tem HTTPS** (porta 443 fechada, o Chrome bloqueia com "não seguro"), **não é responsivo** (não tem sequer meta viewport) e o layout é datado. O cliente já está insatisfeito e quer modernizar. **Esta é uma venda em andamento: o site precisa impressionar.**

## Missão

Recriar **todas as páginas** do site atual, com o mesmo conteúdo real (textos, produtos, fotos), mas com UI de nível sênior, responsivo de verdade e com animação moderna e bem executada.

Não é um "port". É um redesign completo. O conteúdo é o mesmo; a apresentação tem que ser outra.

## O negócio (contexto real, use na copy)

- Fundada em **1992**, em Petrópolis/RJ. Mais de 30 anos de mercado.
- Se posiciona como a mais experiente e reconhecida da região.
- **Serviços:** película de controle solar e segurança (automotiva e arquitetônica), envelopamento automotivo, som e acessórios, alarmes, polimento de faróis, lavagem a seco, recuperação de para-brisa (conserta em vez de trocar).
- É **credenciada 3M** (tem uma página inteira sobre isso: usar como selo de autoridade, não como página perdida no menu).
- Clientes que já atendeu: GE Celma, Tec Auto (concessionária Ford), Fundação Cultural de Petrópolis, Carl Zeiss. **Isso é prova social forte e hoje está escondido no fim de um parágrafo.**
- Endereço: Rua Cel. Veiga, 1767 e 1771, Cel. Veiga, Petrópolis/RJ
- Telefones: (24) 2246-4978 / (24) 2243-3449 · WhatsApp: (24) 98816-7547
- Instagram: @thedarkfilm · Facebook: /pages/The-Dark-Film-Sound/134567593333951

## Páginas a recriar

Todas existem hoje e devem existir no site novo:

| Página | Observação |
| --- | --- |
| Home | Hero + destaques de serviço + novidades |
| A Empresa | História desde 1992, missão, clientes atendidos |
| Linha Automotiva | Película automotiva, argumentos técnicos |
| Linha Arquitetônica | Película para vidro residencial/comercial |
| Som e Acessórios | Catálogo com muitos itens |
| Características do Film | Conteúdo técnico/educativo |
| Galeria de Fotos | ~85 fotos de trabalhos |
| Eventos | Fotos de eventos, hoje datadas de 2006-2007 |
| 3M | Credenciamento, maior página de texto do site |
| Contato | Formulário, telefones, endereço, mapa |
| Produtos (47 páginas) | Uma página por produto, ver `conteudo-extraido/produtos.json` |

As 47 páginas de produto **não precisam ser 47 rotas estáticas escritas à mão**: use rota dinâmica com os dados vindos de um arquivo de conteúdo.

## O que já está pronto pra você neste repositório

```
site-original/www.thedarkfilm.com.br/   → site antigo completo, baixado (html, css, js, imagens)
  ├─ imagens/                            → assets do layout (bg, logo, ícones, texturas)
  ├─ fotos/                              → 580 fotos reais (galeria, eventos, produtos)
  └─ produtos/                           → 47 páginas de produto originais

conteudo-extraido/
  ├─ paginas-principais.json             → texto + imagens de cada página principal
  └─ produtos.json                       → texto + imagens dos 47 produtos

referencias/prints-site-antigo/          → prints de tela do site atual (LEIA ANTES DE COMEÇAR)
  ├─ 01-home-topo.png
  ├─ 02-home-servicos-rodape.png
  ├─ 03-a-empresa.png
  ├─ 04-eventos.png
  └─ 05-erro-https-chrome.png
```

**Comece olhando os prints.** Eles mostram exatamente o que precisa ser superado.

## Diagnóstico do site atual (o que NÃO repetir)

Confirmado tecnicamente em 25/08/2026:

- **Sem HTTPS.** Porta 443 recusa conexão. Não é certificado vencido, é ausência de HTTPS.
- **PHP 5.3.6** (fim de vida em 2014), versão exposta no header HTTP.
- **Sem meta viewport** → não adapta a celular de forma alguma.
- **Meta description vazia** → Google inventa o snippet.
- **Sem formulário funcional de captação** na home.
- Vídeo do YouTube na home está **indisponível** (link morto).
- Eventos com fotos de **2006 e 2007** apresentadas como se fossem atuais.
- Layout: fundo de textura de madeira, placas de carro espalhadas em volta, tipografia Century Gothic, caixas com borda arredondada e sombra, menu preto. Estética de 2013.

## Direção de design

O tema visual (oficina automotiva, película escura, carro) é bom e deve ser **reinterpretado**, não jogado fora. O problema não é o assunto, é a execução datada.

Diretrizes:

- **Escuro e sofisticado**, coerente com "dark film". Preto/grafite profundo, com um acento (o vermelho da logo é o ponto de partida natural). Nada de textura de madeira, nada de placas de carro decorativas espalhadas.
- **Tipografia contemporânea de verdade**, com hierarquia clara. Century Gothic sai.
- **Foto grande e bem tratada.** A empresa tem 580 fotos reais (385 usadas hoje nas páginas, o resto disponível no servidor): isso é o maior ativo do site e hoje está espremido em miniatura. Antes/depois de aplicação de película é conteúdo visual forte, use.
- **Animação com propósito:** revelação em scroll, transição de página, micro-interação em hover, um hero com movimento. Nada de animação gratuita que atrapalha leitura. Respeitar `prefers-reduced-motion`.
- **Mobile de verdade**, projetado primeiro pra celular, já que é onde a maioria vai acessar.
- **Conversão:** WhatsApp precisa estar sempre acessível, e o formulário de contato precisa funcionar bem. Hoje o caminho pra virar cliente é fraco.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Biblioteca de animação a seu critério (`motion` é uma boa escolha), desde que não pese o carregamento
- Sem backend próprio nesta fase: conteúdo em arquivo, formulário pode ir pra um endpoint simples ou serviço de terceiro

## Cuidados

- **Não invente serviço, preço, prazo ou depoimento.** O conteúdo real está em `conteudo-extraido/`. Se faltar informação, deixe claro como pendência em vez de preencher com texto fictício.
- As fotos de evento são antigas (2006-2007). Não apresente como recentes. Ou trate como "histórico", ou deixe a seção pronta pra receber foto nova.
- Otimize as imagens: as originais vieram de 2013, muitas são pesadas e pequenas ao mesmo tempo.
- Trate a credencial 3M com destaque, é diferencial competitivo real.
