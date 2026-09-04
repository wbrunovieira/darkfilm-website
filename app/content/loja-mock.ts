/**
 * Catálogo FICTÍCIO da loja online — material de apresentação, não conteúdo do site.
 *
 * A maquete é uma cópia da home do projeto Stylos (`~/projects/stylosFrontEcommerce`) adaptada
 * para a marca do cliente: é sobre aquele projeto que a loja dele será construída. Os campos
 * abaixo existem para alimentar o que a home de lá já mostra — selo de promoção, selo de
 * novidade, percentual de desconto, filtro por categoria, marca, tamanho e faixa de preço.
 *
 * **Os preços são inventados e estão marcados como exemplo na tela.** É a única exceção à regra
 * do projeto de não inventar preço, e ela só se sustenta porque a página inteira se apresenta
 * como maquete, com tarja fixa no topo. Quando ele fechar, os valores vêm dele.
 *
 * As camisetas e canecas são mockups gerados com o logo dele (`public/img/loja/`). Os acessórios
 * são as fotos de catálogo que já existem no site, em `public/img/produtos/`.
 */

export type ProdutoLoja = {
  id: string;
  slug: string;
  nome: string;
  categoria: Categoria;
  marca: string;
  /** Em centavos, para não arrastar float. Valor de exemplo. */
  preco: number;
  /** Preço cheio, quando o item está em promoção. Valor de exemplo. */
  precoDe?: number;
  img: string;
  novidade?: boolean;
  /** Tamanhos, quando o produto tem variação. */
  tamanhos?: string[];
  detalhe: string;
};

export const CATEGORIAS = ["Vestuário", "Canecas", "Acessórios"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

/** Cartões de categoria da faixa superior, como os quatro do Stylos. */
export const DESTAQUES: { categoria: Categoria; icone: string; chamada: string }[] = [
  { categoria: "Vestuário", icone: "camiseta", chamada: "Vestir a marca" },
  { categoria: "Canecas", icone: "caneca", chamada: "Para o café da oficina" },
  { categoria: "Acessórios", icone: "chave", chamada: "O que a gente instala" },
];

export const PRODUTOS: ProdutoLoja[] = [
  {
    id: "1", slug: "camiseta-preta", nome: "Camiseta The Dark Film — Preta",
    categoria: "Vestuário", marca: "The Dark Film", preco: 8900,
    img: "/img/loja/camiseta-preta.jpg", novidade: true,
    tamanhos: ["P", "M", "G", "GG"],
    detalhe: "Algodão, estampa da marca no peito.",
  },
  {
    id: "2", slug: "camiseta-branca", nome: "Camiseta The Dark Film — Branca",
    categoria: "Vestuário", marca: "The Dark Film", preco: 8900,
    img: "/img/loja/camiseta-branca.jpg", novidade: true,
    tamanhos: ["P", "M", "G", "GG"],
    detalhe: "Algodão, estampa da marca no peito.",
  },
  {
    id: "3", slug: "caneca-preta", nome: "Caneca The Dark Film — Preta",
    categoria: "Canecas", marca: "The Dark Film", preco: 4900,
    img: "/img/loja/caneca-preta.jpg",
    detalhe: "Cerâmica, 325 ml. Marca em um lado.",
  },
  {
    id: "4", slug: "caneca-vermelha", nome: "Caneca The Dark Film — Vermelha",
    categoria: "Canecas", marca: "The Dark Film", preco: 4900, precoDe: 5900,
    img: "/img/loja/caneca-vermelha.jpg",
    detalhe: "Cerâmica, 325 ml. Marca em um lado.",
  },
  {
    id: "5", slug: "farois-de-led", nome: "Faróis de LED",
    categoria: "Acessórios", marca: "Diversos", preco: 24900,
    img: "/img/produtos/farois-de-led-1.jpg",
    detalhe: "Par de faróis auxiliares de LED.",
  },
  {
    id: "6", slug: "lampadas-crystal-vision", nome: "Lâmpadas Crystal Vision",
    categoria: "Acessórios", marca: "Philips", preco: 12900, precoDe: 15900,
    img: "/img/produtos/lampadas-crystal-vision-philips-1.jpg",
    detalhe: "Par. Luz mais branca que a lâmpada comum.",
  },
  {
    id: "7", slug: "filtro-de-ar-esportivo", nome: "Filtro de ar esportivo",
    categoria: "Acessórios", marca: "Race Chrome", preco: 15900,
    img: "/img/produtos/filtro-de-ar-esportivo-1.jpg",
    detalhe: "Filtro cônico lavável.",
  },
  {
    id: "8", slug: "tapetes-borcol", nome: "Tapetes BORCOL",
    categoria: "Acessórios", marca: "Borcol", preco: 17900,
    img: "/img/produtos/tapetes-borcol-1.jpg",
    detalhe: "Jogo de tapetes. Consulte o modelo do carro.",
  },
  {
    id: "9", slug: "subwoofer", nome: "Subwoofer",
    categoria: "Acessórios", marca: "Regency", preco: 39900,
    img: "/img/produtos/subwoofer-1.jpg", novidade: true,
    detalhe: "Grave para o som do carro.",
  },
  {
    id: "10", slug: "bateria-moura", nome: "Bateria Moura",
    categoria: "Acessórios", marca: "Moura", preco: 54900,
    img: "/img/produtos/baterias-moura-1.jpg",
    detalhe: "Consulte a amperagem para o seu carro.",
  },
  {
    id: "11", slug: "buzinas-esportivas", nome: "Buzinas esportivas",
    categoria: "Acessórios", marca: "Diversos", preco: 8900,
    img: "/img/produtos/buzinas-esportivas-1.jpg",
    detalhe: "Par de buzinas.",
  },
  {
    id: "12", slug: "capa-para-estepe", nome: "Capa para estepe",
    categoria: "Acessórios", marca: "Diversos", preco: 13900, precoDe: 16900,
    img: "/img/produtos/capas-para-estepe-1.jpg",
    detalhe: "Personalizável. Consulte a medida do estepe.",
  },
];

export const MARCAS = [...new Set(PRODUTOS.map((p) => p.marca))].sort();
export const TAMANHOS = ["P", "M", "G", "GG"];

/** Desconto em % a partir do par de preços, para o selo do card. */
export function desconto(p: ProdutoLoja) {
  if (!p.precoDe) return 0;
  return Math.round((1 - p.preco / p.precoDe) * 100);
}

/** 8900 -> "R$ 89,00" */
export function reais(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
