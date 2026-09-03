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

export const produtos: Produto[] = (data as Produto[]).filter((p) => !DESCONTINUADOS.has(p.slug));

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

export const categorias: Record<number, { nome: string; href: string }> = {
  1: { nome: "Serviços automotivos", href: "/peliculas-automotivas" },
  2: { nome: "Películas arquitetônicas", href: "/peliculas-arquitetonicas" },
  3: { nome: "Som e acessórios", href: "/som-e-acessorios" },
};

/** Agrupamento do catálogo de som e acessórios (classificação editorial para filtro). */
export const grupos: { id: string; nome: string; slugs: string[] }[] = [
  {
    id: "som",
    nome: "Som e multimídia",
    slugs: [
      "subwoofer", "kit-duas-vias", "auto-falantes-triaxiais", "amplificadores-de-potencia",
      "caixas-seladas-regency", "bazookas-regency", "auto-radio-usb-bluetooth", "kits-multimidia",
      "receptor-de-tv-digital-automotivo", "gps-navegador-portatil", "antenas", "cameras-de-re",
    ],
  },
  {
    id: "seguranca",
    nome: "Alarmes e segurança",
    slugs: [
      "alarmes-automotivos-positron-px-fx", "alarmes-automotivos-sistec", "alarmes-automotivos-kostal",
      "alarme-para-motocicletas-positron-duoblock", "sensor-de-estacionamento", "vidros-e-travas-eletricas",
      "modulos-de-levantamento-de-vidros-anti-esmagamento",
    ],
  },
  {
    id: "iluminacao",
    nome: "Iluminação",
    slugs: [
      "lampadas-xenon-6000k-8000k", "lampadas-crystal-vision-philips", "lampadas-blue-vision-philips",
      "farois-auxiliares", "farois-de-led",
    ],
  },
  {
    id: "acessorios",
    nome: "Acessórios",
    slugs: [
      "engates-dhf", "engates-enforth", "buzinas-esportivas", "buzina-caracol", "protetores-de-carter",
      "acessorios-automotivos-tg-poli", "acessorios-automotivos-bepo", "capotas-maritimas", "tapetes-borcol",
      "bagageiros-e-racks", "capas-para-estepe", "rodas-e-pneus-esportivos", "filtro-de-ar-esportivo",
      "manometros", "linha-de-personalizacao-shutt", "palhetas-para-limpador-de-parabrisas", "baterias-moura",
    ],
  },
];

export function grupoDe(slug: string) {
  return grupos.find((g) => g.slugs.includes(slug));
}

export function getProduto(slug: string) {
  return produtos.find((p) => p.slug === slug);
}

export const catalogoSom = produtos.filter((p) => p.category === 3);
