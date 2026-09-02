# Auditoria independente — catalogação de mídia The Dark Film & Sound

Auditor independente, sem acesso às conclusões do time anterior além do que está no
`catalogo.csv` entregue. Todas as evidências abaixo foram verificadas diretamente:
fotos e frames de vídeo abertos e inspecionados (com zoom via crop quando necessário),
vídeos checados via `ffprobe`, duplicatas via `md5sum` sobre os arquivos originais em
`originais/thedarkfilm/`.

---

## 1. "70 mídias têm placa ou rosto visível"

**CONTESTADO — subestimado.**

A contagem de 70 (64 fotos + 6 vídeos com flag `placa-visivel` e/ou `rosto-visivel`)
está matematicamente correta *para o que foi marcado*. O problema é o que ficou de
fora: revisei 40 mídias **não marcadas**, distribuídas por categoria e data (acima do
mínimo de 35 pedido), e encontrei **5 arquivos com placa legível e não sinalizada**,
cobrindo 3 cenas distintas:

| Arquivo | Categoria / uso | Flag atual | O que tem |
| --- | --- | --- | --- |
| `20251023_115043.jpg` | outro / galeria | `bagunca-no-fundo` | Placa Mercosul legível no sedã marrom ao fundo (confirmei com crop 6x) |
| `20251107_195512.jpg` | outro / **hero** | `sequencia-parecida` | Placa "GLX1C12" nitidamente legível no para-choque da picape azul |
| `20251107_195532.jpg` | outro / descartar | `sequencia-parecida` | Mesma placa "GLX1C12", mesma picape |
| `20251107_195532(1).jpg` | outro / galeria | `sequencia-parecida` | Mesma placa "GLX1C12", mesma picape (a versão que fica no ar) |
| `IMG-20260115-WA0032.jpg` | outro / galeria | `sequencia-parecida` | Placa "LMG-6840" legível no para-choque do Pajero branco |

O caso do Pajero é revelador do padrão do erro: `IMG-20260115-WA0030.jpg` (mesmo
veículo, ângulo parecido) **foi** marcado `placa-visivel` corretamente — mas
`WA0032.jpg`, tirada segundos depois, não foi. O critério foi aplicado de forma
inconsistente mesmo dentro da mesma sequência de fotos.

Também há um padrão mais sutil, que não conta para os 70 mas é um risco real: paredes
da oficina decoradas com **placas antigas reais** (ex. `20220819_204141.jpg`,
`20250508_141047.jpg`, `20221018_172440.jpg`, `20251204_163359.jpg` — "88 7090",
"965-HFH", "CTI-1056" etc.). Tratei como decoração/prop e não como identificação de
veículo de terceiro, mas vale confirmar com o cliente se alguma é placa real
recuperada de um carro específico.

Fora placas/rostos: `20260512_161748.jpg` (painel de BMW) mostra o nome do cliente
("Gustavo") na tela multimídia conectada por Bluetooth — não é placa nem rosto, mas é
dado pessoal identificável, e a mídia está sem nenhuma flag.

**Taxa de erro:** 3 de 40 arquivos amostrados (7,5%) tinham placa legível não
detectada. Projetando sobre as 199 mídias hoje sem flag, é razoável esperar mais
casos não revisados aqui. Recomendo segunda passada focada em fotos de "outro" com
carro visto de frente ou de trás a curta distância — é onde os 5 falsos negativos
apareceram, todos em placas dianteiras/traseiras sem o porta-placa "The Dark Film"
cobrindo os caracteres.

---

## 2. "Quatro serviços sem foto aproveitável: alarme, polimento de faróis, lavagem a seco, recuperação de para-brisa"

**CONFIRMADO.**

Revisei 25 mídias de `outro` e `som-acessorios` (amostra estratificada por data) e fiz
uma busca textual em todo o `catalogo.csv` (alt, arquivo) por variações de
alarme/polimento/farol opaco/lavagem a seco/para-brisa trincado — zero ocorrências.
Nenhuma das 25 imagens revisadas mostra instalação de alarme, polimento de farol
(há fotos com farol *aceso* ou *em detalhe*, mas nenhuma mostrando o processo de
polimento/recuperação de lente amarelada), lavagem a seco em andamento, ou reparo de
trinca em para-brisa. O que existe de "para-brisa" no acervo é instalação de
**película** em vidro (categoria correta: `pelicula-automotiva`), não recuperação de
trinca.

Concordo com a conclusão prática: não há material aproveitável desses quatro serviços
no lote atual. Vale pedir ao cliente especificamente essas quatro categorias.

---

## 3. "140 de 269 são 'outro', sem evidência visual de serviço"

**CONFIRMADO, com ressalva de contexto.**

Revisei 28 mídias distintas de `outro` (acima do mínimo de 20) cobrindo praticamente
toda a faixa de datas do acervo (2018–2026). Em nenhuma delas há um serviço sendo
executado: são carros customizados/de coleção estacionados na loja (Fusca, Kombi,
Opala, réplica de F1, hot rods), detalhes de painel/interior sem ação em curso, e
fachada/decoração da oficina. A categoria "outro" está descrevendo corretamente o que
está nas fotos — não é uma muleta para evitar classificar algo óbvio; é genuinamente
um carro parado, sem evidência de trabalho.

**Ressalva importante:** o áudio do cliente (`pedido-cliente-2026-09-02.md`, já no
repositório) pede explicitamente "os carros mais maneiros" como vitrine separada da
galeria de serviço. Ou seja, "sem evidência de serviço" é tecnicamente correto, mas
não deve virar sinônimo de "descartável" — boa parte dessas 140 mídias é exatamente o
material que o cliente quer usar, só que para uma seção diferente (vitrine de carros),
não para provar competência técnica.

---

## 4. Qualidade dos textos alternativos (`alt`)

**CONFIRMADO COM RESSALVA — um erro real encontrado.**

Amostrei 15 arquivos aleatoriamente (seed fixa para reprodutibilidade) e conferi cada
alt contra a imagem/frame correspondente:

- **Erro real:** `20260320_112836.jpg` — alt diz *"tela exibindo câmera de ré
  instalada"*. Abri a imagem em zoom: a tela central mostra um rádio FM sintonizado em
  "107.10 MHz" com ícones de música, não uma imagem de câmera de ré. O alt inventa uma
  funcionalidade que a foto não mostra.
- **Menor / não verificável pela imagem:** `20240607_174228.jpg` — alt afirma
  "Porsche Cayenne", mas o crop mostra apenas o emblema "e-hybrid" sem nenhuma
  identificação de modelo visível no quadro. Pode estar correto (a Porsche usa esse
  emblema em vários modelos), mas não é confirmável só pela imagem.
- **Trivial:** `20240705_142349.jpg` — alt diz "carro estacionado" (singular); a foto
  mostra dois carros estacionados.
- As outras 12 mídias amostradas (`20251219_191023.mp4`, `20250508_134133.jpg`,
  `20240327_144630.mp4`, `20240704_140442.jpg`, `20240712_164940.jpg`,
  `20260323_123920.jpg`, `20240524_143429.mp4`, `VID-20260822-WA0013.mp4`,
  `20250621_144439(1).jpg`, `20240327_143605.jpg`, `20260605_182728(1).jpg`,
  `20260523_164130.mp4`) têm alt fiel ao conteúdo — nenhuma inventa marca, nome de
  cliente ou serviço não confirmado pela imagem.

Não é um padrão sistemático de invenção, mas o caso da câmera de ré mostra que pelo
menos uma descrição foi gerada sem checagem visual cuidadosa.

---

## 5. Checagens mecânicas

### 5a. Vídeos verticais na exibição

**CONFIRMADO.** Rodei `ffprobe` sobre os 65 vídeos originais e computei a orientação
efetiva aplicando a rotação do `side_data` (Display Matrix). Os 55 vídeos gravados
"deitados" (1920×1080 ou 1280×720) carregam `rotation=-90`, e os 10 vídeos
`VID-*-WA*.mp4` já nascem com dimensão nativa vertical (478×850, sem tag de rotação).
Aplicando a rotação a todos, **os 65 exibem em pé (altura > largura)** — zero exceções.

### 5b. 29 duplicatas exatas, todas com sufixo "(1)"

**CONFIRMADO.** Rodei `md5sum` sobre todos os 269 arquivos em `originais/thedarkfilm/`.
Encontrei exatamente **29 grupos de hash duplicado**, cada grupo com exatamente 2
arquivos, e em **todos os 29 casos** um dos dois nomes tem o sufixo `(1)` (ex.
`20260827_205647.mp4` / `20260827_205647(1).mp4`). Não há nenhuma duplicata exata sem
esse padrão de nome, e não há nenhum grupo com 3+ cópias idênticas.

---

## Risco de publicação

Mídias que **não devem ir ao ar** sem tratamento (recorte, blur de placa, ou
substituição), com o `uso` atual entre parênteses:

1. `20251107_195512.jpg` (**hero**) — placa legível, maior visibilidade possível.
2. `20251107_195532(1).jpg` (galeria) — mesma placa.
3. `IMG-20260115-WA0032.jpg` (galeria) — placa legível do Pajero.
4. `20251023_115043.jpg` (galeria) — placa legível ao fundo.
5. `20260512_161748.jpg` (uso não crítico hoje, mas se for usada) — nome do cliente
   visível na tela do carro; cortar ou desfocar antes de publicar.

Mídias já corretamente sinalizadas e que **continuam bloqueadas até autorização de
imagem do cliente**, sem necessidade de ação adicional deste time: as 64 fotos e 6
vídeos já marcados `placa-visivel`/`rosto-visivel` no catálogo original.

Correção de conteúdo antes de publicar (não é risco de privacidade, é erro factual):
`20260320_112836.jpg` — trocar o alt "câmera de ré instalada" por algo que descreva o
que a tela realmente mostra (rádio/multimídia).
