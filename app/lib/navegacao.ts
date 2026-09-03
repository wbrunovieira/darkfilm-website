/**
 * A que seção do menu cada URL pertence.
 *
 * Existe porque o Header marcava como "atual" só as 9 páginas que estão no menu: nas 45
 * páginas de produto e na home nenhum item acendia. Quem entrava num produto perdia o único
 * indicador de posição do site — uma das causas medidas do "cada hora clico num link e me perco".
 *
 * Não importa `produtos.json` (29 KB) porque o Header é componente de cliente e isso iria
 * inteiro para o bundle. Dos 45 produtos, 41 são de som; só 4 fogem à regra, e estão listados
 * abaixo. `lib/produtos.ts` tem uma checagem que quebra o build se essa lista sair de sincronia
 * com os dados — ou seja, dá para confiar nela sem carregar o catálogo.
 */

/** Produtos cuja seção NÃO é Som e Acessórios. */
export const PRODUTO_FORA_DO_SOM: Record<string, string> = {
  "envelopamento-automotivo": "/peliculas-automotivas",
  "nao-troque-seu-parabrisa-conserte": "/peliculas-automotivas",
  "pelicula-comercial": "/peliculas-arquitetonicas",
  "distribuicao-de-peliculas-ferramentas-para-aplicadores-e-chancelas": "/peliculas-arquitetonicas",
};

/**
 * Seção do menu a que uma URL pertence, ou a própria URL quando ela já é uma seção.
 * Devolve null para a home, que é tratada à parte (só casa por igualdade exata).
 */
export function secaoDaRota(pathname: string): string | null {
  if (pathname === "/") return null;
  if (pathname.startsWith("/produtos/")) {
    const slug = pathname.slice("/produtos/".length);
    return PRODUTO_FORA_DO_SOM[slug] ?? "/som-e-acessorios";
  }
  return pathname;
}
