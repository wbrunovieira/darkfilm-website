/**
 * Tonalidades do mostruário e como cada uma aparece na tela.
 *
 * Vive aqui, e não dentro do simulador, porque o mostruário também é desenhado em página
 * de servidor (Películas Automotivas) — e porque a versão anterior desse mostruário era um
 * JPG de 2013 rotulado "G5 G20 G35 G50 G70", que continuou publicado depois que o cliente
 * pediu para trocar a nomenclatura por porcentagem e estender a escala até 90%. Número
 * dentro de imagem não é encontrado por busca e não acompanha mudança de conteúdo.
 */

export const TONALIDADES = [5, 20, 35, 50, 70, 90] as const;

/** Apelidos em linguagem simples para os códigos do mostruário. */
export const ROTULOS: Record<(typeof TONALIDADES)[number], string> = {
  5: "Bem escura",
  20: "Escura",
  35: "Média",
  50: "Clara",
  70: "Bem clara",
  90: "Quase incolor",
};

/** Rótulo humano para qualquer valor do slider (faixas entre os presets). */
export function rotuloFor(vlt: number) {
  if (vlt <= 12) return ROTULOS[5];
  if (vlt <= 27) return ROTULOS[20];
  if (vlt <= 42) return ROTULOS[35];
  if (vlt <= 60) return ROTULOS[50];
  if (vlt <= 80) return ROTULOS[70];
  return ROTULOS[90];
}

export const MIN = 5;
export const MAX = 90;

/**
 * Quanto a simulação escurece a cena, de 0 (nada) a 1 (opaco).
 *
 * Não é a transmitância física: é a PERCEPÇÃO de quem olha de dentro do carro para
 * fora, que é sempre mais clara do que o número sugere — o olho se adapta e o cérebro
 * compensa. A curva anterior (1 - (vlt/100)^0,6) era fiel ao número e por isso parecia
 * escura demais na tela; o cliente comparou com a aparência real e pediu o ajuste.
 *
 * A referência veio dele, em 03/09/2026: "5% deve parecer o que hoje está no 20%,
 * 20% como o 35%, 35% como o 50%, 50% como o 70%, e o 70% ainda mais claro que isso".
 * Os âncoras abaixo são exatamente essa tradução, com interpolação linear entre eles.
 */
const PERCEPCAO: [number, number][] = [
  [5, 0.62],
  [20, 0.46],
  [35, 0.34],
  [50, 0.19],
  [70, 0.1],
  [90, 0.04],
];

/**
 * Cor da bolinha de cada tonalidade no mostruário da UI.
 *
 * NÃO usa shadeFor: aquela curva é a percepção de uma cena vista pela janela, onde o 5%
 * ainda deixa enxergar. Aplicada a um disco de 20px ela achata tudo em cinza médio e o
 * "Bem escura" fica igual ao "Clara". Aqui a leitura precisa ser de amostra de película,
 * então o ramp é o mesmo da barra de escala em `styles/peliculas.css` — os dois têm que
 * combinar, porque o cliente vê a bolinha aqui e a barra na página do simulador.
 */
export const AMOSTRA: Record<(typeof TONALIDADES)[number], string> = {
  5: "#08080a",
  20: "#1d1e22",
  35: "#3a3b40",
  50: "#6a6c72",
  70: "#a8a9ae",
  90: "#ddddd8",
};

export function shadeFor(vlt: number) {
  const p = PERCEPCAO;
  if (vlt <= p[0][0]) return p[0][1];
  if (vlt >= p[p.length - 1][0]) return p[p.length - 1][1];
  for (let i = 0; i < p.length - 1; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[i + 1];
    if (vlt <= x2) return y1 + ((vlt - x1) / (x2 - x1)) * (y2 - y1);
  }
  return p[p.length - 1][1];
}
