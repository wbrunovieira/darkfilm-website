// Dados fixos da empresa. Fonte: site original (rodapé e página "A Empresa").

/** Domínio de produção. Sobrescreva com NEXT_PUBLIC_SITE_URL em preview. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thedarkfilm.com.br";
export const site = {
  name: "The Dark Film & Sound",
  shortName: "The Dark Film",
  founded: 1992,
  city: "Petrópolis",
  state: "RJ",
  address: {
    street: "Rua Cel. Veiga, 1767 e 1771",
    district: "Cel. Veiga",
    city: "Petrópolis",
    state: "RJ",
    full: "Rua Cel. Veiga, 1767 e 1771 — Cel. Veiga, Petrópolis/RJ",
  },
  phones: [
    // (24) 2246-4978 saiu em 03/09/2026 a pedido do cliente: linha desativada.
    { label: "(24) 2243-3449", href: "tel:+552422433449" },
  ],
  whatsapp: {
    label: "(24) 98816-7547",
    number: "5524988167547",
  },
  social: {
    instagram: { handle: "@thedarkfilm", href: "https://instagram.com/thedarkfilm" },
    facebook: {
      href: "https://www.facebook.com/pages/The-Dark-Film-Sound/134567593333951",
    },
  },
  // Ficha no Google (Perfil da Empresa). Nota e contagem informadas em 25/08/2026 — atualizar à mão.
  // PENDÊNCIA: trocar `url` pelo link curto da ficha (g.page/...) ou Place ID quando o cliente enviar.
  google: {
    rating: 4.6,
    reviews: 255,
    updatedAt: "2026-08-25",
    url: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("The Dark Film Petrópolis"),
  },
  // PENDÊNCIA: horário de funcionamento não consta no site antigo — pedir ao cliente.
  hours: null as null | string,
  // Clientes atendidos, conforme página "A Empresa" do site original.
  clients: [
    "GE Celma",
    "Tec Auto — Concessionária Ford",
    "Fundação Cultural de Petrópolis",
    "Carl Zeiss",
  ],
} as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Telefone para dados estruturados e links. Existe porque `site.phones[0]` era lido direto:
 * quando o cliente desativou uma das duas linhas em 03/09/2026 a lista ficou com um item só,
 * e desativar a última quebraria o build por índice inexistente.
 */
export function telefonePrincipal() {
  return site.phones[0]?.href.replace("tel:", "") ?? `+${site.whatsapp.number}`;
}

export function yearsInBusiness(now = new Date()) {
  return now.getFullYear() - site.founded;
}

const DECADAS = ["", "uma", "duas", "três", "quatro", "cinco", "seis"];

/** "três décadas" hoje; vira "quatro décadas" sozinho em 2032. */
export function decadasEmAtividade(now = new Date()) {
  const d = Math.floor(yearsInBusiness(now) / 10);
  return `${DECADAS[d] ?? d} década${d === 1 ? "" : "s"}`;
}

export type NavLink = { href: string; label: string; highlight?: boolean };
export type NavItem = NavLink | { label: string; children: NavLink[] };

export const nav: NavItem[] = [
  /* "Início" existe porque muita gente não descobre que o logo leva para a home — o
     `aria-label` dele é texto invisível para quem enxerga. Manter as duas rotas de volta. */
  { href: "/", label: "Início" },
  { href: "/a-empresa", label: "A Empresa" },
  {
    label: "Películas",
    children: [
      { href: "/peliculas-automotivas", label: "Películas Automotivas" },
      { href: "/peliculas-arquitetonicas", label: "Películas Arquitetônicas" },
      { href: "/caracteristicas-do-film", label: "Características do Film" },
      /* "Legislação", não "Simulador": em 03/09/2026 o cliente simplificou a página para
         mostrar só o que a lei exige em cada vidro — sem escolha de tonalidade e sem a cena
         pelo vidro, que ficaram na home e em Películas Automotivas. Um item de menu chamado
         "Simulador", com selo "Novo", levava à única página onde não se simula nada.
         O nome é dele: a mensagem em que pediu a mudança se chama "PÁGINA DO SIMULADOR /
         LEGISLAÇÃO". Passa a filho de "Películas" porque o próprio topo da página já se
         anunciava como "Películas · Simulador" enquanto o menu o tratava como irmão. */
      { href: "/simulador", label: "Legislação" },
      { href: "/3m", label: "Credenciada 3M" },
    ],
  },
  { href: "/som-e-acessorios", label: "Som e Acessórios" },
  { href: "/galeria", label: "Galeria" },
  { href: "/contato", label: "Contato" },
];
