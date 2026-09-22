/**
 * Películas arquitetônicas — texto do cliente, enviado em 22/09/2026.
 *
 * **Não reescrever.** É dele do começo ao fim, e o cuidado dele é o que protege a loja: repare
 * em quantas vezes escreve "ajuda a", "contribui para", "podem dificultar" em vez de prometer.
 * Em película de segurança isso não é estilo, é a diferença entre informar e garantir.
 *
 * **O que esta página passou a concentrar.** Ele pediu para unificar: "não precisa abrir outra
 * página para Características do Film nem outra para Película Comercial. Tudo pode ficar dentro
 * da própria página de Películas Arquitetônicas, dividido em blocos". Com isso saíram do site
 * três URLs — `/caracteristicas-do-film`, `/produtos/pelicula-comercial` e a de distribuição.
 *
 * **O que ele mandou apagar, e por quê importa.** A divisão "Econômico ou Profissional" e os
 * percentuais soltos — 99%, 79%, 30% — vinham do site de 2013 e apareciam sem dizer de qual
 * película eram. Número de desempenho sem produto ao lado não informa nada e ainda expõe a loja
 * a uma cobrança que ela não tem como sustentar. Nenhum percentual entra aqui.
 */

export const ABERTURA = {
  titulo: "Conforto, proteção e privacidade para seu ambiente.",
  paragrafos: [
    "As películas arquitetônicas oferecem soluções para residências, empresas, escritórios, lojas e fachadas de vidro. Ajudam no controle do calor e da luminosidade, aumentam a privacidade e a segurança e contribuem para proteger móveis, pisos, cortinas, tecidos e objetos contra os efeitos da exposição solar.",
    "Também podem transformar a aparência dos vidros e renovar ambientes sem a necessidade de grandes reformas, com opções para diferentes necessidades de transparência, controle solar, segurança, privacidade e decoração.",
  ],
} as const;

/** `icone` casa com a chave do mapa em `components/peliculas/BeneficiosArq.tsx`. */
export type Beneficio = { id: string; icone: string; titulo: string; texto: string };

/** Bloco 2. Ele pediu explicitamente "tópicos/cards, com ícones e textos curtos". */
export const BENEFICIOS: Beneficio[] = [
  {
    id: "controle-solar",
    icone: "calor",
    titulo: "Controle solar e conforto térmico",
    texto:
      "Ajuda a reduzir a entrada de calor e o excesso de luminosidade, proporcionando ambientes mais agradáveis e contribuindo para reduzir a necessidade de climatização.",
  },
  {
    id: "uv",
    icone: "uv",
    titulo: "Proteção UV e contra o desbotamento",
    texto:
      "Elevada proteção contra os raios ultravioleta, ajudando a reduzir os efeitos da exposição solar sobre móveis, pisos, cortinas, tecidos, objetos e acabamentos internos.",
  },
  {
    id: "privacidade",
    icone: "privacidade",
    titulo: "Privacidade",
    texto:
      "Permite aumentar a privacidade de residências, escritórios, consultórios, salas, vitrines e outros ambientes, proporcionando maior conforto e discrição para quem está no interior.",
  },
  {
    id: "seguranca",
    icone: "estilhaco",
    titulo: "Segurança e proteção do vidro",
    texto:
      "Películas específicas ajudam a manter os fragmentos do vidro unidos em caso de quebra, reduzindo a projeção de estilhaços. Em vitrines, fachadas, portas e grandes áreas envidraçadas, películas de segurança também podem dificultar a ruptura do vidro e retardar o acesso ao interior em tentativas de arrombamento.",
  },
  {
    id: "estetica",
    icone: "decoracao",
    titulo: "Estética e decoração",
    texto:
      "Permitem transformar e personalizar os vidros, criar efeitos visuais, renovar ambientes e modificar a aparência de portas, divisórias, fachadas e outras superfícies envidraçadas sem necessidade de substituir o vidro existente.",
  },
];

/**
 * Bloco 3. Sem ícone, de propósito: ele só pediu ícone nos benefícios, e repetir a mesma
 * moldura de cartão nos dois blocos seguidos faria a página parecer dizer duas vezes a mesma
 * coisa — que é exatamente o defeito que ele mandou corrigir.
 */
export type Tipo = { id: string; titulo: string; texto: string };

export const TIPOS: Tipo[] = [
  {
    id: "refletivas",
    titulo: "Refletivas / espelhadas",
    texto:
      "Películas de controle solar com maior efeito refletivo externo, ajudando a reduzir a entrada de calor e o excesso de luminosidade, além de proporcionar maior privacidade durante o dia.",
  },
  {
    id: "semi-refletivas",
    titulo: "Semi-refletivas",
    texto:
      "Oferecem boa eficiência no controle solar, com redução de calor e luminosidade, porém com aparência mais discreta e menor efeito espelhado.",
  },
  {
    id: "fume",
    titulo: "Fumê",
    texto:
      "Visual mais neutro e tradicional, disponível em diferentes níveis de escurecimento. Ajuda no controle da luminosidade e proporciona maior privacidade ao ambiente.",
  },
  {
    id: "nanotecnologicas",
    titulo: "Nanotecnológicas",
    texto:
      "Películas profissionais de alta performance, desenvolvidas para proporcionar elevada redução de calor, conforto térmico e excelente qualidade óptica, inclusive em opções de maior transparência.",
  },
  {
    id: "incolores",
    titulo: "Incolores / alta transparência",
    texto:
      "Indicadas para quem busca proteção térmica e UV preservando ao máximo a entrada de luz natural e a aparência original do vidro.",
  },
  {
    id: "privativas",
    titulo: "Privativas e decorativas",
    texto:
      "Soluções desenvolvidas para bloquear ou limitar a visão através dos vidros, proporcionando privacidade independentemente das condições de iluminação. Ideais para portas, divisórias, salas, escritórios, consultórios, banheiros, vitrines e outros ambientes. Também permitem personalizar os vidros e criar diferentes efeitos visuais, sem necessidade de substituir o vidro existente.",
  },
  {
    id: "seguranca",
    titulo: "Películas de segurança",
    texto:
      "Películas de maior espessura que reforçam o conjunto vidro + película e ajudam a manter os fragmentos unidos em caso de quebra, reduzindo a projeção de estilhaços. São indicadas também para vitrines, fachadas, portas de vidro, lojas, residências e empresas, onde podem dificultar a ruptura do vidro e retardar o acesso ao interior em tentativas de arrombamento.",
  },
];

/**
 * Bloco 4. Substitui a página de produto que existia só para isso.
 *
 * "Ferramentas para aplicadores" e "chancelas" saíram por pedido dele. Os kits pré-cortados
 * estão marcados como PROPOSTA — palavra dele: "podemos incluir também a proposta futura de
 * kits". Não é serviço em operação, e o texto tem que deixar isso claro para não virar promessa.
 */
export const DISTRIBUICAO = {
  titulo: "Películas e soluções para aplicadores",
  texto:
    "Além da instalação profissional, trabalhamos com fornecimento de películas e materiais para aplicadores.",
  futuro:
    "Podemos incluir também a proposta futura de kits de películas pré-cortadas, preparados nas medidas e formatos necessários para facilitar a aplicação.",
  botao: "Falar sobre fornecimento",
  mensagem:
    "Olá! Sou aplicador e gostaria de falar sobre fornecimento de películas e materiais.",
} as const;

/** Bloco 5. Título e subtítulo são os que ele sugeriu. */
export const GALERIA = {
  titulo: "Alguns dos nossos trabalhos",
  subtitulo:
    "Aplicações realizadas em residências, empresas, escritórios, lojas e fachadas.",
} as const;
