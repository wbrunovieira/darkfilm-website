/**
 * Polimento de vidros automotivos — texto do cliente, enviado em 19/09/2026.
 *
 * **Não reescrever.** Ele mandou duas versões e marcou esta, a mais completa, como "texto
 * correto": a diferença é o parágrafo do processo, com as granulometrias e o óxido de cério.
 *
 * E não suavizar as ressalvas. "Remover ou reduzir", "cada vidro é avaliado antes" e "riscos
 * mais profundos podem não ser totalmente eliminados" são dele, e são o que protege a loja de
 * reclamação depois. Texto de venda que promete demais em serviço de recuperação volta como
 * problema no balcão.
 *
 * Ele pediu isto como seção DENTRO da página do conserto de para-brisa, não como página nova —
 * são o mesmo assunto, vidro do carro, e o projeto já tem 56 páginas.
 */

export const POLIMENTO = {
  titulo: "Polimento de vidros automotivos",
  chamada: "Recupere a transparência e a aparência dos vidros do seu carro.",
  paragrafos: [
    "Realizamos polimento em para-brisa, vidros laterais e vidro traseiro, para remover ou reduzir marcas de palheta, riscos provocados pelas pestanas e canaletas dos vidros, manchas de chuva ácida e outras imperfeições superficiais.",
    "O processo é realizado com lixas e abrasivos específicos para vidro, em diferentes granulometrias, de acordo com o tipo e a profundidade das marcas. O acabamento é feito com compostos próprios para polimento de vidro, incluindo óxido de cério, recuperando a transparência e o brilho da superfície.",
    "Antes do serviço, cada vidro é avaliado para determinar a possibilidade de recuperação, pois riscos mais profundos podem não ser totalmente eliminados.",
  ],
  botao: "Solicitar avaliação",
  /** Mensagem pronta do WhatsApp, no mesmo padrão da consulta da Thule. */
  mensagem:
    "Olá! Gostaria de solicitar uma avaliação de polimento dos vidros do meu carro.",
  imagem: {
    src: "/img/servicos-v2/polimento-vidros.jpg",
    alt: "Politriz com boina de espuma polindo o para-brisa de um carro na oficina",
    w: 1400,
    h: 933,
  },
  /** Onde o bloco aparece. Ele pediu "nesta mesma página". */
  slug: "nao-troque-seu-parabrisa-conserte",
} as const;
