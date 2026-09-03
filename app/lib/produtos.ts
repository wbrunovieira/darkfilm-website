import data from "@/content/produtos.json";

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

export const produtos: Produto[] = data as Produto[];

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
