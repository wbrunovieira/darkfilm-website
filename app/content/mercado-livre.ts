/**
 * Texto da Agência Mercado Livre, escrito pelo cliente e enviado em 12/09/2026.
 *
 * **Não reescrever.** Cada bloco delimita o que a loja faz e o que não faz, e manda quem tem
 * problema de compra procurar a plataforma. É texto de responsabilidade, não de marketing:
 * mexer na redação muda o que a loja está assumindo perante o comprador.
 *
 * Fica em arquivo separado por isso mesmo: quando ele pedir ajuste, muda aqui e o layout não
 * precisa ser tocado.
 */

export const CHAMADA = {
  titulo: "Somos Agência Mercado Livre",
  linha: "A loja de confiança do seu bairro.",
  servicos: ["Envios", "Retiradas", "Devoluções", "Trocas"],
  botao: "Saiba como funciona",
} as const;

export const ABERTURA = {
  titulo: "Agência Mercado Livre na The Dark Film",
  texto:
    "A The Dark Film também funciona como ponto de apoio da logística do Mercado Livre, oferecendo praticidade para compradores e vendedores.",
} as const;

export type Passo = { id: string; titulo: string; texto: string };

export const PASSOS: Passo[] = [
  {
    id: "envio",
    titulo: "Envio de vendas",
    texto:
      "Vendeu pelo Mercado Livre? Quando a plataforma indicar o envio por uma Agência Mercado Livre, traga o pacote preparado e identificado conforme as orientações para seguimento pela logística do Mercado Livre.",
  },
  {
    id: "retirada",
    titulo: "Retirada de compras",
    texto:
      "Escolheu receber sua compra em uma Agência Mercado Livre? Após a confirmação de que o pedido está disponível, venha até a loja e apresente o QR Code fornecido pelo Mercado Livre para realizar a retirada.",
  },
  {
    id: "devolucao",
    titulo: "Devoluções",
    texto:
      "Quando a devolução pela agência for autorizada pelo Mercado Livre, basta trazer o produto devidamente preparado e apresentar o QR Code gerado pela plataforma.",
  },
  {
    id: "troca",
    titulo: "Trocas",
    texto:
      "Quando essa modalidade estiver disponível, a agência também poderá ser utilizada para a retirada do novo produto e entrega daquele que será devolvido, seguindo as instruções do Mercado Livre.",
  },
];

export const IMPORTANTE = {
  titulo: "Importante",
  paragrafos: [
    "A The Dark Film atua exclusivamente como ponto de apoio logístico credenciado. Envios, retiradas, devoluções e trocas somente podem ser realizados quando previamente autorizados pelo Mercado Livre e mediante a apresentação do QR Code ou identificação fornecida pela plataforma.",
    "Questões relacionadas a compras, vendas, pagamentos, reembolsos, prazos, cancelamentos, reclamações ou autorizações devem ser tratadas diretamente pelos canais de atendimento do Mercado Livre.",
  ],
} as const;
