/**
 * Texto da Revenda Autorizada Thule, escrito pelo cliente e enviado em 17/09/2026.
 *
 * **Não reescrever.** É ele quem define o que a loja oferece e como quer ser apresentada perante
 * a marca. Fica em arquivo separado para ajuste dele não esbarrar em layout.
 *
 * Uma regra explícita do pedido, que vale repetir aqui porque é fácil desfazer sem querer:
 * **nenhum link para o configurador ou a loja virtual da Thule.** Ele quer a consulta de
 * compatibilidade acontecendo dentro da casa dele, pelo WhatsApp.
 */

export const CHAMADA = {
  titulo: "Revenda autorizada Thule",
  itens: ["Racks de teto", "Transbikes", "Bagageiros", "Acessórios"],
  linha: "Venda, orientação e instalação profissional.",
  botao: "Conheça a linha Thule",
} as const;

export const ABERTURA = {
  titulo: "The Dark Film, revenda autorizada Thule",
  paragrafos: [
    "A The Dark Film é Revenda Autorizada Thule, uma das marcas mais reconhecidas mundialmente em soluções para transporte e acessórios para veículos.",
    "Trabalhamos com racks de teto, suportes para bicicletas (transbikes), bagageiros e acessórios, oferecendo orientação para a escolha do equipamento adequado para cada veículo e instalação profissional.",
  ],
} as const;

export type Linha = { id: string; titulo: string; texto: string };

export const LINHAS: Linha[] = [
  {
    id: "racks",
    titulo: "Racks de teto",
    texto:
      "Sistemas de racks e barras desenvolvidos para diferentes modelos de veículos, combinando segurança, resistência, praticidade e excelente acabamento.",
  },
  {
    id: "transbikes",
    titulo: "Transbikes",
    texto:
      "Soluções para o transporte seguro de bicicletas, com diferentes opções de instalação e modelos para atender cada necessidade.",
  },
  {
    id: "bagageiros",
    titulo: "Bagageiros e acessórios",
    texto:
      "Soluções para aumentar a capacidade de carga do veículo e proporcionar mais praticidade em viagens, esporte e lazer.",
  },
];

export const CONSULTA = {
  titulo: "Encontre a solução Thule certa para o seu veículo",
  texto:
    "Informe marca, modelo e ano do veículo. Nossa equipe verifica os produtos compatíveis e indica a melhor opção para sua necessidade.",
  botao: "Consultar pelo WhatsApp",
  /** Mensagem pronta, com os campos em branco para a pessoa completar, como ele pediu. */
  mensagem: "Olá! Gostaria de consultar um produto Thule para o meu veículo. Marca/modelo: __ Ano: __.",
} as const;
