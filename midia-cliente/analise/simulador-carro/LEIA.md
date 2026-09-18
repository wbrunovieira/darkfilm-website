# O carro do simulador — as duas opções para o cliente escolher

Material da conversa de 18/09/2026 com o cliente.

**O que se manda para ele é a página `/carro`**, não um print: lá ele toca nos vidros dos dois
carros e compara na prática. A página é interna — sem link em lugar nenhum, fora do sitemap,
noindex nela e no robots. Sai do ar quando ele decidir.

| Arquivo | O que é |
| --- | --- |
| `comparativo-simulador.png` | Print da página `/carro`, para quando não der para abrir o link |
| `abarth-tratada.jpg` | A foto já tratada: recortada, placa pixelada, uma pessoa ao fundo borrada. 3060×1900. É a origem de `app/public/img/simulador/abarth-oficina.webp` |

## Por que existem duas opções

O cliente pediu, em 12/09, um carro "mais moderno, de preferência um sedã ou SUV, com desenho
limpo e proporcional". **Cinco tentativas de desenho foram reprovadas** entre 10 e 18/09:
"quadrado", "deformado", "amassado atrás", "ainda distorcido", "piorou muito". Cada correção
quebrava outra coisa — traseira, frente, cavas, proporção vidro/lataria.

O desenho voltou a ser o que ele já conhece, e a decisão passou para ele: manter o desenho,
contratar um ilustrador profissional, ou trocar por foto.

## A opção da foto

`midia-cliente/originais/thedarkfilm/20260204_160912.jpg` — o Fiat Fastback Abarth preto dele,
na própria oficina, com as placas The Dark Film ao fundo.

Serve porque é vista 3/4 frontal: aparecem **os três grupos que o simulador precisa** — para-brisa
grande, vidro da porta dianteira e vidro da porta traseira. Num perfil puro o para-brisa some atrás
da coluna A, que é o motivo de o desenho de hoje precisar de duas vistas.

Carro de verdade é proporcional por definição: o problema que derrubou os cinco desenhos deixa de
existir.

**Tratamento já aplicado:** placa `RJX9F20` pixelada e o topo de uma cabeça, que aparecia atrás do
teto, borrado.

## Os contornos dos vidros

Estão em `app/components/simulador/CarroFoto.tsx`, em `viewBox="0 0 400 248"` sobre a foto tratada.

São **`path` com curva, não polígono**: numa vista 3/4 nenhuma dessas áreas é um quadrilátero — o
teto é curvo, a coluna A é diagonal e a linha de cintura desce para a frente. Quadrilátero reto fica
visivelmente fora do vidro, e foi a primeira coisa que o cliente notou.

São **três, e não quatro**: nesta foto o vidro traseiro não é área clicável clara (ali se vê a
coluna C e a carroceria virando), e ele cairia no mesmo grupo do vidro da porta traseira, que já
está marcado.

**Como foram traçados, caso precise refazer com outra foto:** ampliar a cabine num recorte
conhecido, projetar por cima uma grade nas coordenadas do próprio `viewBox` (é o truque que torna
a leitura direta, sem conta), ler os pontos, desenhar, renderizar e conferir. Quatro passes.

Tamanho dos alvos no desktop, medidos no navegador: para-brisa 145×54 px, porta dianteira 49×38,
porta traseira 38×29. Os dois últimos ficam abaixo dos 44 px recomendados para toque — **não dá
para ampliar sem cortar o carro**, que já ocupa a largura toda da foto. A lista de vidros abaixo do
desenho continua sendo o controle principal, e no simulador ela está sempre visível.

## O que ficou fora

- **Não existe outra foto no acervo que sirva.** Foram varridas as 204 recentes e o acervo antigo.
  A única outra de perfil perpendicular com quatro portas é o Defender preto
  (`20231220_151747.jpg`), mas nela o para-brisa fica de topo e não dá para clicar.
- Se ele quiser foto melhor, o pedido é: **carro de 4 portas, cor clara, vidros ainda sem película,
  3/4 frontal baixo, carro inteiro no quadro, na horizontal, sem placa legível e sem gente.** Cinco
  minutos na oficina. Ele já deve a foto do passo 3 (vista de dentro do carro olhando para fora) —
  é uma ida só para as duas.
