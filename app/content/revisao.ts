/**
 * O que o cliente revisa: cada página do site e as seções que ela tem, na ordem em que
 * aparecem, pelo título que se lê na tela.
 *
 * É este arquivo que adapta a ferramenta para outro projeto — a página de revisão, a rota de
 * registro e os componentes não sabem nada sobre a The Dark Film. Trocar esta lista basta.
 *
 * Os `id` são a chave dos eventos registrados. **Nunca renomeie um id de página ou seção que
 * já esteja em uso**: o histórico de aprovação está amarrado a ele. Mudar o `titulo` é livre.
 */

export type SecaoRevisao = { id: string; titulo: string };

export type PaginaRevisao = {
  id: string;
  titulo: string;
  /** Caminho no site, aberto em nova aba a partir da revisão. */
  href: string;
  grupo: string;
  /** Uma frase curta sobre o que a pessoa deve olhar naquela página. */
  nota?: string;
  secoes: SecaoRevisao[];
};

export const paginasRevisao: PaginaRevisao[] = [
  {
    id: "home",
    titulo: "Home",
    href: "/",
    grupo: "Páginas do site",
    secoes: [
      { id: "pelicula-som-e-acessorios-com-34-anos-de-estrada", titulo: "Película, som e acessórios com 34 anos de estrada." },
      { id: "tres-especialidades-uma-oficina", titulo: "Três especialidades, uma oficina." },
      { id: "veja-a-tonalidade-antes-de-aplicar", titulo: "Veja a tonalidade antes de aplicar." },
      { id: "aplicadora-credenciada-3m", titulo: "Aplicadora credenciada 3M." },
      { id: "agencia-mercado-livre", titulo: "Agência Mercado Livre" },
      { id: "revenda-autorizada-thule", titulo: "Revenda autorizada Thule" },
      { id: "nossa-qualidade-e-atestada-pelo-servico-prestado", titulo: "Nossa qualidade é atestada pelo serviço prestado aos clientes." },
      { id: "na-oficina", titulo: "Na oficina" },
      { id: "som-e-a-outra-metade-do-nome", titulo: "Som é a outra metade do nome" },
      { id: "venha-nos-fazer-uma-visita", titulo: "Venha nos visitar." },
    ],
  },
  {
    id: "a-empresa",
    titulo: "A Empresa",
    href: "/a-empresa",
    grupo: "Páginas do site",
    secoes: [
      { id: "a-mais-experiente-e-reconhecida-da-regiao", titulo: "A mais experiente e reconhecida da região." },
      { id: "desde-1992-anos-de-mercado-e-credencial", titulo: "Desde 1992, anos de mercado e credencial" },
      { id: "de-1992-ate-hoje", titulo: "De 1992 até hoje." },
      { id: "qualidade-e-rapidez-buscando-sempre-a-satisfacao", titulo: "Qualidade e rapidez, buscando sempre a satisfação total do cliente." },
      { id: "nossa-qualidade-e-atestada-pelo-servico-prestado", titulo: "Nossa qualidade é atestada pelo serviço prestado aos clientes." },
      { id: "venha-nos-fazer-uma-visita", titulo: "Venha nos visitar." },
    ],
  },
  {
    id: "peliculas-automotivas",
    titulo: "Películas Automotivas",
    href: "/peliculas-automotivas",
    grupo: "Páginas do site",
    secoes: [
      { id: "aplicacao-perfeita-sem-emendas", titulo: "Aplicação perfeita, do material ao acabamento." },
      { id: "simule-a-sua-pelicula", titulo: "Simule a sua película." },
      { id: "pelicula-automotiva-de-protecao-e-seguranca", titulo: "Película automotiva de proteção e segurança." },
      { id: "mais-para-o-seu-carro", titulo: "Mais para o seu carro" },
      { id: "venha-nos-fazer-uma-visita", titulo: "Venha nos visitar." },
    ],
  },
  {
    id: "peliculas-arquitetonicas",
    titulo: "Películas Arquitetônicas",
    href: "/peliculas-arquitetonicas",
    grupo: "Páginas do site",
    secoes: [
      { id: "solucao-atrativa-e-eficiente", titulo: "Solução atrativa e eficiente." },
      { id: "o-vidro-quebra-o-film-segura", titulo: "O vidro quebra, o film segura." },
      { id: "ver-sem-ser-visto", titulo: "Ver sem ser visto." },
      { id: "reducao-dos-custos-de-refrigeracao", titulo: "Redução dos custos de refrigeração." },
      { id: "aparencia-adequada-e-decoracao-de-interiores", titulo: "Aparência adequada e decoração de interiores." },
      { id: "peliculas-arquitetonicas-produtos", titulo: "Películas arquitetônicas (produtos)" },
      { id: "continue-por-aqui", titulo: "Continue por aqui" },
      { id: "venha-nos-fazer-uma-visita", titulo: "Venha nos visitar." },
    ],
  },
  {
    id: "caracteristicas-do-film",
    titulo: "Características do Film",
    href: "/caracteristicas-do-film",
    grupo: "Páginas do site",
    secoes: [
      { id: "o-que-e-film-afinal", titulo: "O que é film, afinal?" },
      { id: "dividido-nas-seguintes-categorias", titulo: "Dividido nas seguintes categorias:" },
      { id: "conforto-seguranca-e-economia", titulo: "Conforto, segurança e economia." },
      { id: "economico-ou-profissional-garantia", titulo: "Econômico ou profissional. (garantia)" },
      { id: "onde-aplicar", titulo: "Onde aplicar" },
      { id: "venha-nos-fazer-uma-visita", titulo: "Venha nos visitar." },
    ],
  },
  {
    id: "3m",
    titulo: "Credenciada 3M",
    href: "/3m",
    grupo: "Páginas do site",
    secoes: [
      { id: "menos-calor-mais-protecao", titulo: "Menos calor. Mais proteção." },
      { id: "por-que-3m", titulo: "Por que 3M" },
      { id: "cinco-peliculas-cinco-propositos", titulo: "Cinco películas, cinco propósitos." },
      { id: "lado-a-lado-comparativo", titulo: "Lado a lado. (comparativo)" },
      { id: "veja-a-3m-aplicada", titulo: "Veja a 3M aplicada" },
      { id: "venha-nos-fazer-uma-visita", titulo: "Venha nos visitar." },
    ],
  },
  {
    id: "thule",
    titulo: "Revenda Thule",
    href: "/thule",
    grupo: "Páginas do site",
    secoes: [
      { id: "revenda-autorizada-thule", titulo: "Revenda autorizada Thule." },
      { id: "the-dark-film-revenda-autorizada-thule", titulo: "The Dark Film, revenda autorizada Thule" },
      { id: "encontre-a-solucao-thule-certa", titulo: "Encontre a solução Thule certa para o seu veículo" },
    ],
  },
  {
    id: "legislacao",
    titulo: "Legislação",
    href: "/simulador",
    grupo: "Páginas do site",
    secoes: [
      { id: "veja-a-tonalidade-antes-de-aplicar", titulo: "Veja a tonalidade antes de aplicar." },
      { id: "qual-vidro-voce-quer-consultar-o-que-a-lei-permi", titulo: "Qual vidro você quer consultar? / O que a lei permite" },
      { id: "o-que-o-numero-da-pelicula-significa", titulo: "O que o número da película significa." },
      { id: "venha-nos-fazer-uma-visita", titulo: "Venha nos visitar." },
    ],
  },
  {
    id: "som-e-acessorios",
    titulo: "Som e Acessórios",
    href: "/som-e-acessorios",
    grupo: "Páginas do site",
    secoes: [
      { id: "nacionais-e-importados-tudo-em-um-lugar", titulo: "Som e Acessórios. Tudo em um só lugar." },
      { id: "escolha-o-grupo-ou-busque-catalogo", titulo: "O que fazemos em som e acessórios. (11 categorias)" },
      { id: "venha-nos-fazer-uma-visita", titulo: "Venha nos visitar." },
    ],
  },
  {
    id: "galeria",
    titulo: "Galeria",
    href: "/galeria",
    grupo: "Páginas do site",
    secoes: [
      { id: "trabalhos-de-verdade", titulo: "Trabalhos de verdade." },
      { id: "carros-que-passam-por-aqui", titulo: "Carros que passam por aqui" },
      { id: "aplicacao-de-pelicula-em-carros", titulo: "Aplicação de película em carros" },
      { id: "envelopamento", titulo: "Envelopamento" },
      { id: "multimidia-e-acessorios", titulo: "Multimídia e acessórios" },
      { id: "pelicula-arquitetonica", titulo: "Película arquitetônica" },
      { id: "a-loja", titulo: "A loja" },
      { id: "o-que-fazemos", titulo: "O que fazemos" },
      { id: "venha-nos-fazer-uma-visita", titulo: "Venha nos visitar." },
    ],
  },
  {
    id: "contato",
    titulo: "Contato",
    href: "/contato",
    grupo: "Páginas do site",
    secoes: [
      { id: "fale-com-a-gente", titulo: "Fale com a gente." },
      { id: "envie-sua-mensagem-formulario", titulo: "Envie sua mensagem. (formulário)" },
      { id: "ou-chame-direto-telefones-e-whatsapp", titulo: "Ou chame direto. (telefones e WhatsApp)" },
      { id: "onde-estamos-endereco-e-mapa", titulo: "Onde estamos (endereço e mapa)" },
    ],
  },
  {
    id: "produto-envelopamento-automotivo",
    titulo: "Envelopamento Automotivo",
    href: "/produtos/envelopamento-automotivo",
    grupo: "Produtos — Películas Automotivas",
    secoes: [{ id: "pagina", titulo: "Texto, fotos e tudo o que estiver nesta página" }],
  },
  {
    id: "produto-nao-troque-seu-parabrisa-conserte",
    titulo: "Não troque seu para-brisa, conserte!",
    href: "/produtos/nao-troque-seu-parabrisa-conserte",
    grupo: "Produtos — Películas Automotivas",
    secoes: [{ id: "pagina", titulo: "Texto, fotos e tudo o que estiver nesta página" }],
  },
  {
    id: "produto-distribuicao-de-peliculas-ferramentas-para-aplicadores-e-chancelas",
    titulo: "Distribuição de películas / ferramentas para aplicadores e chancelas",
    href: "/produtos/distribuicao-de-peliculas-ferramentas-para-aplicadores-e-chancelas",
    grupo: "Produtos — Películas Arquitetônicas",
    secoes: [{ id: "pagina", titulo: "Texto, fotos e tudo o que estiver nesta página" }],
  },
  {
    id: "produto-pelicula-comercial",
    titulo: "Película Comercial",
    href: "/produtos/pelicula-comercial",
    grupo: "Produtos — Películas Arquitetônicas",
    secoes: [{ id: "pagina", titulo: "Texto, fotos e tudo o que estiver nesta página" }],
  },
];
