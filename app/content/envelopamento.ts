/**
 * Envelopamento automotivo — fotos e textos enviados pelo cliente em 19/09/2026 (WhatsApp, 16h56
 * e 17h06), da pasta compartilhada do Google Drive.
 *
 * **O pedido dele, na íntegra:** trocar a foto principal pelo Camaro feito na própria loja,
 * substituir o texto, e "na área onde atualmente aparece apenas a foto do Audi RS4, criar uma
 * galeria de fotos dos envelopamentos realizados pela The Dark Film". Miniaturas, clique para
 * ampliar, anterior e seguinte, e deslize no celular. Título e subtítulo são palavra por palavra
 * os que ele escreveu.
 *
 * **Sobre o "antes e depois" que ele perguntou se dava:** dá, mas só nesta picape. Das 99 fotos
 * que ele mandou, a Hilux é a única com a sequência inteira, e a graça é que em duas delas o
 * carro aparece metade preto e metade prata NA MESMA FOTO — não é um par montado, é o meio da
 * aplicação. Nos outros carros ele mandou só o resultado. Por isso a transformação é um bloco
 * próprio, com passos, e não um comparador de arrastar: entre a foto preta e a prata o caminhão
 * muda de posição e de distância, e a linha divisória revelaria dois carros diferentes.
 *
 * **As legendas descrevem só o que está na imagem.** Nada de prazo, material ou processo que ele
 * não tenha escrito.
 *
 * **Placas:** nove das 99 tinham placa legível e foram mascaradas antes de exportar, no mesmo
 * mosaico já usado na galeria do site. A placa preta "The Dark Film" que aparece na maioria dos
 * carros é a de cortesia da loja, é marca dele, e fica.
 */

export type FotoEnvel = { src: string; w: number; h: number; alt: string };

const R = "/img/envelopamento";

/** Texto da página, escrito por ele. Não reescrever, não encurtar. */
export const TEXTO = {
  chamada: "Personalização, proteção e um novo visual para o seu carro.",
  /** Ele pediu este rótulo no botão, no lugar do "Consultar disponibilidade" padrão. */
  botao: "Solicitar orçamento",
  mensagem:
    "Olá! Gostaria de solicitar um orçamento de envelopamento automotivo.",
} as const;

/**
 * A transformação da Hilux, na ordem em que aconteceu.
 *
 * A segunda foto mostra a picape desmontada — sem legenda, isso lê como funilaria e não como
 * envelopamento. A legenda existe para resolver exatamente isso.
 */
export const TRANSFORMACAO: (FotoEnvel & { passo: string; legenda: string })[] = [
  {
    src: `${R}/envel--transformacao-1-metade-preta-metade-prata.jpg`,
    w: 1600,
    h: 1200,
    alt: "Toyota Hilux com o capô e a lateral dianteira já em prata fosco e o restante da carroceria ainda preto",
    passo: "Como começa",
    legenda: "O capô já envelopado, a lateral ainda na cor original. O mesmo carro, na mesma foto.",
  },
  {
    src: `${R}/envel--transformacao-2-desmontada.jpg`,
    w: 1600,
    h: 1200,
    alt: "Hilux desmontada na oficina, com portas e caçamba separadas da carroceria",
    passo: "O que ninguém vê",
    legenda: "Peças fora do carro para o adesivo entrar por baixo das bordas, e não parar nelas.",
  },
  {
    src: `${R}/envel--transformacao-3-cacamba-na-metade.jpg`,
    w: 1600,
    h: 1200,
    alt: "Caçamba da Hilux com metade da lateral em prata fosco e a outra metade ainda preta",
    passo: "Pedaço a pedaço",
    legenda: "A caçamba no meio do caminho: dá para ver a linha exata onde o prata encontra o preto.",
  },
  {
    src: `${R}/envel--transformacao-4-pronta-prata-fosco.jpg`,
    w: 1600,
    h: 1200,
    alt: "Hilux pronta, inteira em prata fosco, de frente na oficina",
    passo: "Como sai",
    legenda: "Pronta, em prata fosco, sem uma gota de tinta na pintura original.",
  },
];

/**
 * A galeria que ele pediu. Um recorte das 99: os melhores ângulos de cada carro, sem as repetidas
 * e sem os detalhes que não se sustentam sozinhos.
 *
 * A ordem é proposital — abre com carro inteiro trocando de cor, segue para teto bicolor (que é
 * o serviço de maior volume dele: 26 das 99 fotos), depois faixas, e fecha com a personalização
 * fora do carro de rua, que o próprio subtítulo dele abre espaço para incluir.
 */
export const GALERIA: FotoEnvel[] = [
  // Carro inteiro
  { src: `${R}/envel--lancer-vermelho-frente.jpg`, w: 1600, h: 1200, alt: "Mitsubishi Lancer vermelho de frente, com detalhes escurecidos" },
  { src: `${R}/envel--lancer-vermelho-perfil.jpg`, w: 1600, h: 1200, alt: "Mitsubishi Lancer vermelho de perfil, com rodas pretas" },
  { src: `${R}/envel--lancer-prata-frente.jpg`, w: 1600, h: 1200, alt: "Mitsubishi Lancer prata de frente na oficina" },
  { src: `${R}/envel--lancer-prata-perfil.jpg`, w: 1600, h: 1200, alt: "Mitsubishi Lancer prata de perfil" },
  { src: `${R}/envel--focus-preto-teto-union-jack.jpg`, w: 1200, h: 1600, alt: "Ford Focus preto com a bandeira britânica no teto" },
  { src: `${R}/envel--uno-frota-lateral.jpg`, w: 1600, h: 1200, alt: "Fiat Uno de frota envelopado em verde e branco, visto de lado" },

  // Teto e detalhes em outra cor
  { src: `${R}/envel--creta-branco-teto-preto.jpg`, w: 1600, h: 1200, alt: "Hyundai Creta branco com o teto e as colunas em preto" },
  { src: `${R}/envel--compass-branco-teto-preto-traseira.jpg`, w: 1600, h: 1200, alt: "Jeep Compass branco com teto preto, visto de trás" },
  { src: `${R}/envel--compass-branco-teto-preto-de-cima.jpg`, w: 1600, h: 1200, alt: "Jeep Compass branco visto de cima, com o teto preto inteiro" },
  { src: `${R}/envel--kia-soul-teto-vermelho-traseira.jpg`, w: 1600, h: 1200, alt: "Kia Soul branco com teto vermelho, visto de trás" },
  { src: `${R}/envel--kia-soul-teto-vermelho-frente.jpg`, w: 1600, h: 1200, alt: "Kia Soul branco com teto vermelho, de frente" },
  { src: `${R}/envel--kicks-vermelho-teto-bege-perfil.jpg`, w: 1600, h: 1200, alt: "Nissan Kicks vermelho com teto bege, de perfil" },
  { src: `${R}/envel--kicks-vermelho-teto-bege-traseira.jpg`, w: 1200, h: 1600, alt: "Nissan Kicks vermelho com teto bege, visto de trás" },
  { src: `${R}/envel--kicks-cinza-teto-laranja-frente.jpg`, w: 1200, h: 1600, alt: "Nissan Kicks cinza com teto laranja, de frente" },
  { src: `${R}/envel--suv-preto-teto-laranja-de-cima.jpg`, w: 1600, h: 1200, alt: "SUV preto visto de cima, com o teto em laranja" },
  { src: `${R}/envel--peugeot-2008-teto-laranja.jpg`, w: 1600, h: 1200, alt: "Peugeot 2008 marrom com o teto em amarelo" },

  // Mini
  { src: `${R}/envel--mini-vermelho-faixas-brancas-frente.jpg`, w: 1200, h: 1600, alt: "Mini vermelho com teto branco e faixas brancas no capô" },
  { src: `${R}/envel--mini-vermelho-teto-branco-traseira.jpg`, w: 1600, h: 1200, alt: "Mini vermelho com teto branco, visto de trás" },
  { src: `${R}/envel--mini-cinza-faixas-verdes.jpg`, w: 1200, h: 1600, alt: "Mini cinza com faixas verdes no capô" },
  { src: `${R}/envel--mini-countryman-faixas-vermelhas-traseira.jpg`, w: 1200, h: 1600, alt: "Mini Countryman branco com faixas vermelhas, visto de trás" },
  { src: `${R}/envel--mini-countryman-faixas-vermelhas-frente.jpg`, w: 1200, h: 1600, alt: "Mini Countryman branco com faixas vermelhas no capô" },

  // Faixas e capô
  { src: `${R}/envel--camaro-preto-capo-faixas.jpg`, w: 1200, h: 1600, alt: "Camaro preto com faixas prata e vermelhas no capô" },
  { src: `${R}/envel--camaro-preto-faixas-prata-frente.jpg`, w: 1200, h: 1600, alt: "Camaro preto de frente, com faixa prata no capô" },
  { src: `${R}/envel--camaro-prata-faixas-pretas-frente.jpg`, w: 1600, h: 1200, alt: "Camaro prata de frente, com faixas pretas no capô" },
  { src: `${R}/envel--camaro-prata-faixas-pretas-traseira.jpg`, w: 1600, h: 1200, alt: "Camaro prata visto de trás, com as faixas pretas correndo até o porta-malas" },
  { src: `${R}/envel--detalhe-fibra-de-carbono.jpg`, w: 1200, h: 1600, alt: "Detalhe de aplicação com textura de fibra de carbono no capô" },
  { src: `${R}/envel--mustang-faixas-preto-e-branco.jpg`, w: 1200, h: 1600, alt: "Mustang com faixas pretas e brancas no capô" },
  { src: `${R}/envel--chevette-azul-faixa-no-capo.jpg`, w: 1200, h: 1600, alt: "Chevette azul com faixa preta no capô" },

  // Personalização fora do carro de rua
  { src: `${R}/envel--mini-infantil-metade-envelopado.jpg`, w: 1600, h: 1200, alt: "Mini elétrico infantil com metade da carroceria já em rosa e a outra metade na cor original" },
  { src: `${R}/envel--mini-infantil-rosa.jpg`, w: 1600, h: 1200, alt: "Mini elétrico infantil pronto, envelopado em rosa" },
  { src: `${R}/envel--scooter-gulf-frente.jpg`, w: 1200, h: 1600, alt: "Scooter Yamaha envelopada nas cores azul e laranja, de frente" },
  { src: `${R}/envel--bike-quadro-camaleao.jpg`, w: 1200, h: 1600, alt: "Bicicleta com o quadro envelopado em efeito camaleão verde" },
  { src: `${R}/envel--carrinho-prata-numero-13.jpg`, w: 1600, h: 1200, alt: "Carro de corrida antigo em miniatura, envelopado em prata espelhado" },
  { src: `${R}/envel--moto-honda-xre.jpg`, w: 1200, h: 1600, alt: "Moto Honda XRE com carenagem envelopada em branco, azul e vermelho" },
  { src: `${R}/envel--geladeira-volkswagen.jpg`, w: 1200, h: 1600, alt: "Geladeira antiga envelopada em azul, com o nome Volkswagen na porta" },
  { src: `${R}/envel--capacete-fibra-de-carbono.jpg`, w: 1200, h: 1600, alt: "Capacete envelopado com textura de fibra de carbono" },
];

/** Capa nova: o Camaro feito na própria loja, com o letreiro The Dark Film ao fundo. */
export const CAPA: FotoEnvel = {
  src: `${R}/envel--capa-camaro-na-loja.jpg`,
    w: 1536,
    h: 1024,
  alt: "Camaro preto com faixas prata e vermelhas, dentro da oficina da The Dark Film",
};

/** Onde este conteúdo aparece. */
export const SLUG = "envelopamento-automotivo";
