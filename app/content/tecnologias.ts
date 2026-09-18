/**
 * As tecnologias de película automotiva, escritas pelo cliente e enviadas em 12/09/2026.
 *
 * **Não reescrever, e em especial não mexer nas garantias.** São compromissos que ele assume com
 * o cliente final — 3, 10, 12, 15 e 3 anos saíram dele, não de nenhuma tabela nossa. Se algum
 * número mudar, tem que vir dele por escrito.
 *
 * O texto substitui o bloco que vinha depois do simulador, que era quase todo sobre película de
 * segurança. Palavras dele: "substituir o conteúdo atual, hoje muito concentrado em película de
 * segurança, por uma apresentação mais completa das tecnologias de películas automotivas".
 *
 * Nenhuma marca aparece aqui de propósito: a loja é multimarca, e foi ele quem pediu, em 02/09,
 * que a exclusividade 3M saísse desta parte do site.
 */

export const ABERTURA = {
  titulo: "Conheça as tecnologias em películas automotivas",
  texto:
    "Existem diferentes tecnologias de películas automotivas, desde as linhas profissionais tradicionais até soluções de alta performance. Cada tecnologia possui características próprias de conforto térmico, transparência, privacidade, proteção e desempenho.",
} as const;

export type Tecnologia = {
  id: string;
  titulo: string;
  texto: string;
  /** Anos de garantia, palavra dele. */
  garantia: number;
};

/**
 * Quatro tecnologias em escada de desempenho, da mais tradicional à de maior performance — a
 * garantia sobe junto, de 3 para 15 anos, e é ela que conta essa história sozinha.
 */
export const TECNOLOGIAS: Tecnologia[] = [
  {
    id: "poliester",
    titulo: "Poliéster profissional",
    texto:
      "A linha mais tradicional de películas automotivas. Oferece diferentes níveis de transparência para controle de luminosidade, privacidade e estética, além de elevada proteção contra os raios UV. Uma excelente opção de custo-benefício.",
    garantia: 3,
  },
  {
    id: "nanocarbono",
    titulo: "Nanocarbono",
    texto:
      "Tecnologia com partículas de carbono que proporciona melhor desempenho térmico e maior estabilidade de cor em relação às películas convencionais. Oferece boa redução de calor, conforto e qualidade óptica, com opções em diferentes níveis de transparência.",
    garantia: 10,
  },
  {
    id: "nanoceramica",
    titulo: "Nanocerâmica",
    texto:
      "Tecnologia de alta performance desenvolvida para proporcionar elevada rejeição de calor sem depender apenas do escurecimento dos vidros. Disponível desde opções mais escuras até películas de alta transparência, combinando excelente conforto térmico e ótima visibilidade.",
    garantia: 12,
  },
  {
    id: "multicamadas",
    titulo: "Multicamadas de alta performance",
    texto:
      "Tecnologia avançada formada por múltiplas camadas extremamente finas, desenvolvida para oferecer alto desempenho no controle da energia solar e excelente qualidade óptica. Permite alcançar elevada proteção térmica inclusive em películas de alta transparência.",
    garantia: 15,
  },
];

/**
 * A quinta fica separada das outras quatro porque **não é um degrau da mesma escada**: resolve
 * outro problema. As quatro acima competem em conforto térmico e transparência; esta compete em
 * resistência. Enfileirada com as demais, a garantia de 3 anos leria como "a pior", quando ela é
 * simplesmente de outra natureza. O texto é dele, palavra por palavra.
 */
export const SEGURANCA = {
  id: "seguranca",
  titulo: "Proteção e segurança / antivandalismo",
  texto:
    "Película de maior espessura desenvolvida para aumentar a resistência do conjunto vidro + película. Em tentativas de invasão, ajuda a dificultar a ruptura e o acesso rápido ao interior do veículo. Em acidentes ou impactos, ajuda a manter os fragmentos de vidro unidos, reduzindo a projeção de estilhaços e podendo dificultar a passagem de objetos através do vidro para o interior do veículo. Disponível em diferentes níveis de transparência, permitindo combinar segurança, privacidade e estética.",
  garantia: 3,
} as const;
