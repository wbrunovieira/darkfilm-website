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
    { label: "(24) 2246-4978", href: "tel:+552422464978" },
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

export function yearsInBusiness(now = new Date()) {
  return now.getFullYear() - site.founded;
}

export type NavLink = { href: string; label: string; highlight?: boolean };
export type NavItem = NavLink | { label: string; children: NavLink[] };

export const nav: NavItem[] = [
  { href: "/a-empresa", label: "A Empresa" },
  {
    label: "Películas",
    children: [
      { href: "/linha-automotiva", label: "Linha Automotiva" },
      { href: "/linha-arquitetonica", label: "Linha Arquitetônica" },
      { href: "/caracteristicas-do-film", label: "Características do Film" },
      { href: "/3m", label: "Credenciada 3M" },
    ],
  },
  { href: "/simulador", label: "Simulador", highlight: true },
  { href: "/som-e-acessorios", label: "Som e Acessórios" },
  { href: "/galeria", label: "Galeria" },
  { href: "/contato", label: "Contato" },
];
