/**
 * A história da The Dark Film, escrita pelo cliente e enviada em 22/09/2026, 00h13.
 *
 * **Não reescrever.** O texto é dele do começo ao fim, e o valor dele está justamente no que
 * uma agência não teria como inventar: os kits vindos do Paraguai, os carros dos amigos, o
 * estágio, a regulamentação de 1998, a garagem da família, o primeiro ponto no Morin. Isso é
 * o que a página não tinha — ela repetia a Home e se descrevia como "a mais experiente e
 * reconhecida da região", que é afirmação sobre si mesma, não história.
 *
 * **Uma única correção de digitação:** ele escreveu "Bairri Morin"; ficou "Bairro Morin", que é
 * o bairro de Petrópolis. Nada além disso foi tocado.
 *
 * **As fotos são o achado desta rodada.** Ele mandou três imagens de arquivo que casam exatamente
 * com o que o texto conta: a aplicação sendo feita na garagem de casa, e duas da primeira loja,
 * com a placa antiga "The Dark Film — Películas e Pinturas". Elas dão à página uma prova visual
 * que nenhuma foto atual daria, porque mostram o antes.
 *
 * **A pessoa na primeira foto fica** — decisão do Bruno em 22/09. É a origem da história, e
 * borrar quem está aplicando a película seria apagar o assunto da foto.
 *
 * **Placas:** os três carros tinham placa legível e foram mascaradas no mosaico já usado no
 * resto do site. São carros dos anos 90 e 2000, mas placa continua sendo placa.
 */

export type BlocoHistoria = {
  id: string;
  titulo?: string;
  paragrafos: string[];
  /** Uma ou duas. Duas quando o mesmo momento tem dois ângulos que valem a pena. */
  fotos?: { src: string; w: number; h: number; alt: string; legenda: string }[];
};

/** Abertura: título e primeiro parágrafo, que entram no topo da página. */
export const ABERTURA = {
  titulo: "Uma história que começou da paixão por carros.",
  intro:
    "A história da The Dark Film começou da paixão por carros e da habilidade para fazer, adaptar e personalizar as coisas. No início dos anos 90, quando as películas automotivas ainda eram uma novidade, alguns kits trazidos do Paraguai chegaram às mãos de Bruno, e ele começou a fazer as primeiras aplicações nos carros dos amigos.",
} as const;

export const HISTORIA: BlocoHistoria[] = [
  {
    id: "o-comeco",
    /* Sem título próprio: estes dois parágrafos são a continuação do texto de abertura, e
       inventar um subtítulo aqui seria acrescentar palavra que não é dele. */
    paragrafos: [
      "O que começou como hobby logo foi crescendo pelo boca a boca. Um carro levava a outro e, enquanto ainda estudava e fazia estágio, Bruno aproveitava os horários livres e os fins de semana para realizar as instalações.",
      "Naquele período, as restrições ao uso de películas ainda eram um grande obstáculo. Em 1998, uma nova regulamentação estabeleceu critérios para a utilização de películas automotivas, abrindo espaço para o crescimento desse mercado.",
    ],
    fotos: [
      {
        src: "/img/empresa/empresa--garagem-primeira-aplicacao.jpg",
        w: 1448,
        h: 1086,
        alt: "Aplicação de película no vidro de um carro, na garagem de uma casa",
        legenda: "As primeiras aplicações, na garagem da família.",
      },
    ],
  },
  {
    id: "do-hobby-para-a-empresa",
    titulo: "Do hobby para a empresa",
    paragrafos: [
      "Com a regulamentação das películas e o crescimento da procura, o que até então era feito nos horários livres ganhou outra dimensão. A demanda aumentou, vieram os primeiros funcionários e surgiu a necessidade de montar uma estrutura maior e profissionalizar definitivamente a atividade.",
      "A The Dark Film deixou a garagem da família e ganhou seu primeiro espaço próprio no Bairro Morin, em Petrópolis, com áreas dedicadas à aplicação, corte das películas, atendimento e administração.",
      "Com o passar dos anos e o crescimento da empresa, veio uma nova mudança: a The Dark Film se instalou na Rua Coronel Veiga, onde permanece até hoje.",
    ],
    fotos: [
      {
        src: "/img/empresa/empresa--primeira-loja-fachada.jpg",
        w: 1448,
        h: 1086,
        alt: "Primeira loja da The Dark Film, com a placa antiga na fachada amarela",
        legenda: "O primeiro espaço próprio, no Morin.",
      },
      {
        src: "/img/empresa/empresa--primeira-loja-rua.jpg",
        w: 1448,
        h: 1086,
        alt: "Primeira loja da The Dark Film vista da rua de paralelepípedo",
        legenda: "A mesma loja, vista da rua.",
      },
    ],
  },
  {
    id: "evoluindo-com-o-mercado",
    titulo: "Evoluindo com o mercado",
    paragrafos: [
      "Ao longo dos anos, a The Dark Film acompanhou a evolução dos veículos, dos materiais e das tecnologias. O trabalho, que começou com películas automotivas, foi ampliado com novos produtos e serviços nas áreas de películas arquitetônicas, som, multimídia, acessórios, segurança e personalização.",
      "Novas tecnologias, equipamentos, marcas e parcerias passaram a fazer parte da empresa, sempre mantendo o cuidado com a instalação, o acabamento e o atendimento que acompanham a The Dark Film desde o início.",
    ],
    fotos: [
      {
        src: "/img/novo/institucional--fachada-dia.jpg",
        w: 2000,
        h: 1500,
        alt: "Fachada atual da The Dark Film, na Rua Coronel Veiga",
        legenda: "A loja hoje, na Coronel Veiga.",
      },
    ],
  },
];

/** Missão: os dois parágrafos dele, sem a lista de serviços que havia antes. */
export const MISSAO = {
  titulo: "Nossa missão",
  paragrafos: [
    "Trabalhar com qualidade, agilidade e atenção aos detalhes, buscando sempre a satisfação de cada cliente.",
    "Oferecer produtos de qualidade, orientação na escolha da melhor solução e instalação profissional, mantendo a confiança construída ao longo de mais de três décadas de trabalho.",
  ],
} as const;
