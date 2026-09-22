/**
 * As 11 categorias de Som e Acessórios, no lugar dos 41 produtos individuais.
 *
 * Pedido do cliente em 22/09/2026, em duas mensagens. **Os títulos e os textos são dele, palavra
 * por palavra** — inclusive a ausência de marca nos títulos, que foi escolha declarada: "não
 * colocar marcas nos títulos, evitando deixar a página presa a fornecedores específicos".
 *
 * Cada cartão mostra capa + título + texto curto. Clicar abre a galeria da categoria ali mesmo,
 * no lightbox que o site já tem — anterior/seguinte, teclado, ampliar e deslize no celular.
 * Ele foi explícito em não querer página nova para isso.
 *
 * **O campo `real`.** Ele pediu "preferencialmente fotos atuais ou de serviços realizados pela
 * própria The Dark Film", e o acervo só atende quatro categorias: multimídia (abundante, várias
 * de 2026), câmeras, pickups e racks. As outras sete usam as imagens de catálogo de 2013, por
 * decisão do Bruno em 22/09 — sem elas, sete das onze categorias ficariam sem capa nenhuma.
 * `real: true` marca o que é foto de trabalho da casa, para saber exatamente o que substituir
 * quando as fotos novas chegarem. Não é decoração: é a lista de pendências embutida no dado.
 *
 * **Duas fotos foram recortadas, e por motivo:**
 * - `som--pickup-capota-maritima`: o terço de cima trazia um cartaz de PREÇO da loja ("a partir
 *   de 4 x R$ 70,00") e um pôster da FARAD. Preço o site inteiro evita, por escolha de projeto;
 *   e a Farad concorre com a Thule, que o texto desta mesma categoria cita como linha da casa.
 * - `som--camera-360-volvo`: o rodapé mostrava as pernas de quem fotografou.
 */

export type FotoSom = { src: string; w: number; h: number; alt: string; /** Foto de trabalho da própria loja, e não imagem de catálogo de 2013. */ real: boolean };

export type CategoriaSom = {
  id: string;
  titulo: string;
  texto: string;
  capa: FotoSom;
  /** A capa é sempre a primeira: a galeria abre na imagem que a pessoa clicou. */
  fotos: FotoSom[];
};

export const CATEGORIAS: CategoriaSom[] = [
  {
    id: "multimidia",
    titulo: "Multimídia e conectividade",
    texto:
      "Centrais multimídia e MP5 com recursos como Bluetooth, Android Auto e Apple CarPlay. Opções específicas para diferentes veículos, preservando, quando possível, comandos de volante e funções originais.",
    capa: { src: "/img/som/som--multimidia-android-auto.jpg", w: 1050, h: 1400, alt: "Central multimídia instalada no painel, com a tela de pareamento do Android Auto", real: true },
    fotos: [
      { src: "/img/som/som--multimidia-android-auto.jpg", w: 1050, h: 1400, alt: "Central multimídia instalada no painel, com a tela de pareamento do Android Auto", real: true },
      { src: "/img/som/som--multimidia-defender-pioneer.jpg", w: 1050, h: 1400, alt: "Central multimídia Pioneer instalada no painel de um Land Rover Defender", real: true },
      { src: "/img/som/som--multimidia-fiat-painel.jpg", w: 1050, h: 1400, alt: "Central multimídia instalada no painel de um Fiat, com a tela ligada", real: true },
      { src: "/img/som/som--multimidia-corolla-painel.jpg", w: 1400, h: 1050, alt: "Painel de Toyota Corolla com central multimídia instalada", real: true },
      { src: "/img/som/som--multimidia-vitrine-ao-fundo.jpg", w: 1050, h: 1400, alt: "Central multimídia instalada, com a vitrine da loja ao fundo", real: true },
    ],
  },
  {
    id: "cameras",
    titulo: "Câmeras e sensores",
    texto:
      "Câmeras de ré, sensores de estacionamento e soluções específicas para veículos com central original. Realizamos também ativação e desbloqueio da função de câmera em veículos compatíveis, utilizando equipamentos específicos.",
    capa: { src: "/img/som/som--camera-re-mitsubishi.jpg", w: 1400, h: 1050, alt: "Central de um Mitsubishi exibindo a imagem da câmera de ré", real: true },
    fotos: [
      { src: "/img/som/som--camera-re-mitsubishi.jpg", w: 1400, h: 1050, alt: "Central de um Mitsubishi exibindo a imagem da câmera de ré", real: true },
      { src: "/img/som/som--camera-360-volvo.jpg", w: 1400, h: 756, alt: "Tela de um Volvo exibindo a visão de câmeras de 360 graus", real: true },
      { src: "/img/novo/multimidia--volvo-camera-re.jpg", w: 2400, h: 1800, alt: "Painel de Volvo com a câmera de ré na tela da central", real: true },
      { src: "/img/produtos/cameras-de-re-1.jpg", w: 1000, h: 1000, alt: "Câmeras e sensores — item do catálogo", real: false },
      { src: "/img/produtos/sensor-de-estacionamento-1.jpg", w: 1000, h: 1000, alt: "Câmeras e sensores — item do catálogo", real: false },
    ],
  },
  {
    id: "som",
    titulo: "Som automotivo",
    texto:
      "Alto-falantes, kits duas vias, amplificadores e subwoofers para melhorar a qualidade e a potência do sistema de áudio do veículo.",
    capa: { src: "/img/produtos/subwoofer-2.jpg", w: 1000, h: 892, alt: "Som automotivo — item do catálogo", real: false },
    fotos: [
      { src: "/img/produtos/subwoofer-2.jpg", w: 1000, h: 892, alt: "Som automotivo — item do catálogo", real: false },
      { src: "/img/produtos/kit-duas-vias-3.jpg", w: 1000, h: 1000, alt: "Som automotivo — item do catálogo", real: false },
      { src: "/img/produtos/auto-falantes-triaxiais-4.jpg", w: 800, h: 800, alt: "Som automotivo — item do catálogo", real: false },
      { src: "/img/produtos/amplificadores-de-potencia-3.jpg", w: 900, h: 754, alt: "Som automotivo — item do catálogo", real: false },
      { src: "/img/produtos/subwoofer-5.jpg", w: 1000, h: 973, alt: "Som automotivo — item do catálogo", real: false },
      { src: "/img/produtos/subwoofer-3.jpg", w: 1000, h: 750, alt: "Som automotivo — item do catálogo", real: false },
    ],
  },
  {
    id: "alarmes",
    titulo: "Alarmes, travas e vidros elétricos",
    texto:
      "Alarmes automotivos, travas elétricas, módulos de vidro e soluções para segurança e conforto, com instalação profissional.",
    capa: { src: "/img/produtos/alarmes-automotivos-positron-px-fx-1.jpg", w: 1000, h: 1000, alt: "Alarmes, travas e vidros elétricos — item do catálogo", real: false },
    fotos: [
      { src: "/img/produtos/alarmes-automotivos-positron-px-fx-1.jpg", w: 1000, h: 1000, alt: "Alarmes, travas e vidros elétricos — item do catálogo", real: false },
      { src: "/img/produtos/alarmes-automotivos-positron-px-fx-2.jpg", w: 1000, h: 1000, alt: "Alarmes, travas e vidros elétricos — item do catálogo", real: false },
      { src: "/img/produtos/vidros-e-travas-eletricas-2.jpg", w: 1000, h: 537, alt: "Alarmes, travas e vidros elétricos — item do catálogo", real: false },
      { src: "/img/produtos/modulos-de-levantamento-de-vidros-anti-esmagamento-2.jpg", w: 600, h: 600, alt: "Alarmes, travas e vidros elétricos — item do catálogo", real: false },
      { src: "/img/produtos/vidros-e-travas-eletricas-1.jpg", w: 500, h: 500, alt: "Alarmes, travas e vidros elétricos — item do catálogo", real: false },
    ],
  },
  {
    id: "iluminacao",
    titulo: "Iluminação automotiva",
    texto:
      "Lâmpadas originais e de reposição, lâmpadas superbrancas, iluminação LED, faróis auxiliares e outras soluções para melhorar a iluminação e o visual do veículo.",
    capa: { src: "/img/produtos/farois-de-led-1.jpg", w: 1000, h: 666, alt: "Iluminação automotiva — item do catálogo", real: false },
    fotos: [
      { src: "/img/produtos/farois-de-led-1.jpg", w: 1000, h: 666, alt: "Iluminação automotiva — item do catálogo", real: false },
      { src: "/img/produtos/farois-de-led-2.jpg", w: 920, h: 613, alt: "Iluminação automotiva — item do catálogo", real: false },
      { src: "/img/produtos/farois-auxiliares-2.jpg", w: 500, h: 359, alt: "Iluminação automotiva — item do catálogo", real: false },
      { src: "/img/produtos/lampadas-crystal-vision-philips-1.jpg", w: 390, h: 470, alt: "Iluminação automotiva — item do catálogo", real: false },
      { src: "/img/produtos/lampadas-blue-vision-philips-1.jpg", w: 370, h: 370, alt: "Iluminação automotiva — item do catálogo", real: false },
    ],
  },
  {
    id: "engates",
    titulo: "Engates e elétrica para reboque",
    texto:
      "Engates fixos ou removíveis para diferentes modelos de veículos, instalação da parte elétrica e módulos eletrônicos específicos quando necessários.",
    capa: { src: "/img/produtos/engates-dhf-1.jpg", w: 600, h: 600, alt: "Engates e elétrica para reboque — item do catálogo", real: false },
    fotos: [
      { src: "/img/produtos/engates-dhf-1.jpg", w: 600, h: 600, alt: "Engates e elétrica para reboque — item do catálogo", real: false },
      { src: "/img/produtos/engates-enforth-1.jpg", w: 500, h: 319, alt: "Engates e elétrica para reboque — item do catálogo", real: false },
    ],
  },
  {
    id: "pickups",
    titulo: "Capotas e acessórios para pickups",
    texto:
      "Capotas marítimas, estribos laterais, Santo Antônio, para-choques de impulsão, protetores de caçamba e outros acessórios para pickups.",
    capa: { src: "/img/som/som--pickup-santo-antonio.jpg", w: 1050, h: 1400, alt: "Santo Antônio e capota marítima instalados na caçamba de uma Hilux", real: true },
    fotos: [
      { src: "/img/som/som--pickup-santo-antonio.jpg", w: 1050, h: 1400, alt: "Santo Antônio e capota marítima instalados na caçamba de uma Hilux", real: true },
      { src: "/img/som/som--pickup-capota-maritima.jpg", w: 1400, h: 1082, alt: "Traseira de Hilux branca com capota marítima e Santo Antônio instalados", real: true },
      { src: "/img/produtos/capotas-maritimas-1.jpg", w: 1000, h: 1000, alt: "Capotas e acessórios para pickups — item do catálogo", real: false },
      { src: "/img/produtos/acessorios-automotivos-bepo-1.jpg", w: 500, h: 323, alt: "Capotas e acessórios para pickups — item do catálogo", real: false },
      { src: "/img/produtos/acessorios-automotivos-bepo-3.jpg", w: 500, h: 500, alt: "Capotas e acessórios para pickups — item do catálogo", real: false },
      { src: "/img/produtos/protetores-de-carter-1.jpg", w: 500, h: 358, alt: "Capotas e acessórios para pickups — item do catálogo", real: false },
    ],
  },
  {
    id: "racks",
    titulo: "Racks, transbikes e bagageiros",
    texto:
      "Racks de teto, suportes para bicicletas, bagageiros e acessórios para transporte. Trabalhamos também com a linha Thule, com orientação e instalação profissional.",
    capa: { src: "/img/som/som--rack-defender-teto.jpg", w: 1400, h: 1050, alt: "Land Rover Defender preto com rack de teto e estribos laterais", real: true },
    fotos: [
      { src: "/img/som/som--rack-defender-teto.jpg", w: 1400, h: 1050, alt: "Land Rover Defender preto com rack de teto e estribos laterais", real: true },
      { src: "/img/produtos/bagageiros-e-racks-1.jpg", w: 1000, h: 1000, alt: "Racks, transbikes e bagageiros — item do catálogo", real: false },
      { src: "/img/produtos/bagageiros-e-racks-2.jpg", w: 1000, h: 1000, alt: "Racks, transbikes e bagageiros — item do catálogo", real: false },
      { src: "/img/produtos/bagageiros-e-racks-6.jpg", w: 625, h: 625, alt: "Racks, transbikes e bagageiros — item do catálogo", real: false },
    ],
  },
  {
    id: "tapetes",
    titulo: "Tapetes automotivos",
    texto:
      "Tapetes específicos para diferentes modelos de veículos, com opções em borracha, carpete e materiais de fácil limpeza e manutenção.",
    capa: { src: "/img/produtos/tapetes-borcol-1.jpg", w: 782, h: 838, alt: "Tapetes automotivos — item do catálogo", real: false },
    fotos: [
      { src: "/img/produtos/tapetes-borcol-1.jpg", w: 782, h: 838, alt: "Tapetes automotivos — item do catálogo", real: false },
      { src: "/img/produtos/tapetes-borcol-2.jpg", w: 800, h: 800, alt: "Tapetes automotivos — item do catálogo", real: false },
    ],
  },
  {
    id: "rodas",
    titulo: "Rodas esportivas",
    texto:
      "Rodas esportivas em diferentes modelos, medidas e furações, com orientação para a aplicação adequada em cada veículo.",
    /* A capa era um pneu Continental, e a categoria que ele escreveu é de RODA. As imagens de
       pneu puro saíram da galeria pelo mesmo motivo: o item antigo do catálogo se chamava
       "rodas e pneus esportivos", e ele separou. */
    capa: { src: "/img/produtos/rodas-e-pneus-esportivos-1.jpg", w: 625, h: 625, alt: "Roda esportiva cromada de aro largo", real: false },
    fotos: [
      { src: "/img/produtos/rodas-e-pneus-esportivos-1.jpg", w: 625, h: 625, alt: "Roda esportiva cromada de aro largo", real: false },
      { src: "/img/produtos/rodas-e-pneus-esportivos-3.jpg", w: 304, h: 304, alt: "Roda esportiva aro claro montada com pneu", real: false },
    ],
  },
  {
    id: "filtros",
    titulo: "Filtros esportivos",
    texto:
      "Filtros de ar esportivos para diferentes veículos, com orientação sobre compatibilidade e aplicação.",
    capa: { src: "/img/produtos/filtro-de-ar-esportivo-1.jpg", w: 1000, h: 670, alt: "Filtros esportivos — item do catálogo", real: false },
    fotos: [
      { src: "/img/produtos/filtro-de-ar-esportivo-1.jpg", w: 1000, h: 670, alt: "Filtros esportivos — item do catálogo", real: false },
    ],
  },
];
