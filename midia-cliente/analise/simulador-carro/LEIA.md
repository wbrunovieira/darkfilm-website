# O carro do simulador — as duas opções para o cliente escolher

Material para a conversa de 18/09/2026 com o cliente. **Nada aqui está publicado no site.**

| Arquivo | O que é |
| --- | --- |
| `comparativo-simulador.png` | **É o que se manda para ele.** Desenho de hoje à esquerda, foto à direita, com os vidros de trás selecionados nos dois |
| `abarth-tratada.jpg` | A foto já tratada: recortada, placa pixelada, uma cabeça ao fundo borrada. 3060×1900 |
| `foto.jpg` | A mesma, reduzida para 1224 px — é a que o comparativo usa |
| `comparativo.html` | Como o comparativo foi montado, caso precise refazer com outro texto |

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
teto, borrado. Confira antes de publicar.

**Coordenadas dos quatro vidros**, em `viewBox="0 0 400 248"` sobre a foto tratada — calibradas
sobre uma grade e conferidas no navegador:

```
parabrisa  162,66 180,30 284,26 273,70
dianteiro  290,30 330,27 332,57 290,61
traseiro   336,27 364,29 366,54 336,57
vigia      370,31 381,33 383,48 370,50
```

Se ele escolher a foto, a implementação é curta: trocar o `dangerouslySetInnerHTML` do
`CarDiagram` por `<Image>` mais um `<svg>` sobreposto com esses quatro polígonos. O CSS de
`.carro-diagrama [data-vidro]` já faz o tracejado, o hover e o vermelho do selecionado — só o
`fill` de repouso muda, de gradiente de vidro para um branco bem translúcido, para a foto aparecer
por baixo.

## O que ficou fora

- **Não existe outra foto no acervo que sirva.** Foram varridas as 204 recentes e o acervo antigo.
  A única outra de perfil perpendicular com quatro portas é o Defender preto
  (`20231220_151747.jpg`), mas nela o para-brisa fica de topo e não dá para clicar.
- Se ele quiser foto melhor, o pedido é: **carro de 4 portas, cor clara, vidros ainda sem película,
  3/4 frontal baixo, carro inteiro no quadro, na horizontal, sem placa legível e sem gente.** Cinco
  minutos na oficina. Ele já deve a foto do passo 3 (vista de dentro do carro olhando para fora) —
  é uma ida só para as duas.
