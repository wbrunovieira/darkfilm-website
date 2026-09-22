import data from "@/content/produtos.json";
import { PRODUTO_FORA_DO_SOM } from "./navegacao";

export type Produto = {
  slug: string;
  title: string;
  subtitle: string;
  /** Categoria do site original: 1 = serviços automotivos, 2 = arquitetônica, 3 = som e acessórios */
  category: number;
  /** HTML limpo (p, ul, li, strong, em, br) vindo da descrição original */
  description: string;
  photos: { src: string; w: number; h: number }[];
};

/**
 * Serviços que a loja não faz mais. O cliente informou em 03/09/2026 ao pedir que saíssem
 * da home; só que eles não estavam só na home — tinham página própria, entravam no
 * sitemap.xml e apareciam como "veja também" em toda página de produto automotivo. Sair da
 * vitrine e continuar à venda numa URL interna é pior do que nunca ter saído.
 *
 * É filtro de dados, não exclusão: o conteúdo original continua em content/produtos.json.
 * Se voltarem a oferecer o serviço, basta tirar o slug daqui.
 */
const DESCONTINUADOS = new Set(["lavagem-a-seco", "polimento-dos-farois"]);

/**
 * O catálogo de som virou 11 CATEGORIAS em 22/09/2026, a pedido do cliente, e os 41 produtos
 * individuais saíram da página. Eles saem também do site: a grade era a única entrada para
 * /produtos/<slug>, e manter 41 URLs vivas no sitemap sem link nenhum apontando para elas é o
 * mesmo erro já corrigido com a lavagem a seco — vitrine fechada, porta dos fundos aberta.
 *
 * É filtro de dados, não exclusão: o conteúdo continua inteiro em content/produtos.json. O que
 * a loja oferece nesses 41 itens está descrito, por categoria, em content/som-categorias.ts.
 */
export const produtos: Produto[] = (data as Produto[]).filter(
  (p) => !DESCONTINUADOS.has(p.slug) && p.category !== 3,
);

/**
 * O Header precisa saber a que seção do menu cada produto pertence, mas é componente de
 * cliente e não pode importar este arquivo sem levar os 29 KB do catálogo junto. Por isso
 * `lib/navegacao.ts` lista à mão os poucos produtos que não são de som. Esta checagem existe
 * para que essa lista nunca minta: se um produto entrar, sair ou mudar de categoria, o build
 * quebra aqui em vez de o menu apagar silenciosamente numa página.
 */
{
  const esperado = produtos
    .filter((p) => p.category !== 3)
    .map((p) => p.slug)
    .sort();
  const declarado = Object.keys(PRODUTO_FORA_DO_SOM).sort();
  if (esperado.join("|") !== declarado.join("|")) {
    throw new Error(
      `lib/navegacao.ts está fora de sincronia com o catálogo.\n` +
        `  esperado: ${esperado.join(", ")}\n` +
        `  declarado: ${declarado.join(", ")}`,
    );
  }
}

/**
 * Os nomes têm que ser IGUAIS aos do menu, do rodapé e do topo das páginas. Antes a categoria 1
 * se chamava "Serviços automotivos" aqui e "Películas Automotivas" em todo o resto do site: o
 * breadcrumb do produto inventava um nome que não existia em lugar nenhum, e a pessoa clicava
 * nele para cair numa página com outro título. Três nomes para o mesmo lugar em um clique.
 */
export const categorias: Record<number, { nome: string; href: string }> = {
  1: { nome: "Películas Automotivas", href: "/peliculas-automotivas" },
  2: { nome: "Películas Arquitetônicas", href: "/peliculas-arquitetonicas" },
  3: { nome: "Som e Acessórios", href: "/som-e-acessorios" },
};


export function getProduto(slug: string) {
  return produtos.find((p) => p.slug === slug);
}

