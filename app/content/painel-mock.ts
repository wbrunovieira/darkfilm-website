/**
 * Dados FICTÍCIOS do painel administrativo. Peça de apresentação, não software em operação.
 *
 * Tudo aqui é inventado: pedidos, clientes, estoque, cupons e faturamento. Nenhum nome, endereço
 * ou valor corresponde a pessoa ou venda real. O painel não fala com servidor nenhum.
 *
 * O catálogo reaproveita os doze produtos que o cliente já viu na vitrine, para as duas telas
 * contarem a mesma história. Os nomes são reescritos sem travessão, que é o combinado para tudo
 * que aparece em tela.
 */

import { PRODUTOS, reais } from "./loja-mock";

export { reais };

export type StatusProduto = "ativo" | "inativo";

export type ItemCatalogo = {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  marca: string;
  preco: number;
  precoDe?: number;
  img: string;
  estoque: number;
  status: StatusProduto;
  temVariacoes: boolean;
};

/** Nome de tela, sem travessão. A vitrine ainda usa o nome antigo. */
const NOME_SEM_TRAVESSAO: Record<string, string> = {
  "1": "Camiseta The Dark Film Preta",
  "2": "Camiseta The Dark Film Branca",
  "3": "Caneca The Dark Film Preta",
  "4": "Caneca The Dark Film Vermelha",
};

/** Estoque e código por produto. Números redondos o bastante para não parecerem sorteados. */
const EXTRA: Record<string, { estoque: number; codigo: string; status?: StatusProduto }> = {
  "1": { estoque: 48, codigo: "TDF-CAM-PRE" },
  "2": { estoque: 31, codigo: "TDF-CAM-BRA" },
  "3": { estoque: 62, codigo: "TDF-CAN-PRE" },
  "4": { estoque: 9, codigo: "TDF-CAN-VER" },
  "5": { estoque: 14, codigo: "ACE-LED-001" },
  "6": { estoque: 27, codigo: "ACE-LAM-CV" },
  "7": { estoque: 8, codigo: "ACE-FIL-ESP" },
  "8": { estoque: 12, codigo: "ACE-TAP-BOR" },
  "9": { estoque: 5, codigo: "ACE-SUB-REG" },
  "10": { estoque: 21, codigo: "ACE-BAT-MOU" },
  "11": { estoque: 0, codigo: "ACE-BUZ-ESP", status: "inativo" },
  "12": { estoque: 6, codigo: "ACE-CAP-EST" },
};

export const CATALOGO: ItemCatalogo[] = PRODUTOS.map((p) => {
  const e = EXTRA[p.id];
  return {
    id: p.id,
    codigo: e.codigo,
    nome: NOME_SEM_TRAVESSAO[p.id] ?? p.nome,
    categoria: p.categoria,
    marca: p.marca,
    preco: p.preco,
    precoDe: p.precoDe,
    img: p.img,
    estoque: e.estoque,
    status: e.status ?? "ativo",
    temVariacoes: Boolean(p.tamanhos),
  };
});

/* ------------------------------------------------------------------ variações */

export type Variacao = {
  cor: string;
  tamanho: string;
  codigo: string;
  estoque: number;
  preco: number;
};

/**
 * Grade de variações da camiseta, que é o exemplo que responde a dúvida do lojista: cada
 * combinação de cor e tamanho tem estoque, preço e código próprios.
 */
export const VARIACOES: Variacao[] = [
  { cor: "Preta", tamanho: "P", codigo: "TDF-CAM-PRE-P", estoque: 9, preco: 8900 },
  { cor: "Preta", tamanho: "M", codigo: "TDF-CAM-PRE-M", estoque: 17, preco: 8900 },
  { cor: "Preta", tamanho: "G", codigo: "TDF-CAM-PRE-G", estoque: 14, preco: 8900 },
  { cor: "Preta", tamanho: "GG", codigo: "TDF-CAM-PRE-GG", estoque: 8, preco: 9400 },
  { cor: "Branca", tamanho: "P", codigo: "TDF-CAM-BRA-P", estoque: 6, preco: 8900 },
  { cor: "Branca", tamanho: "M", codigo: "TDF-CAM-BRA-M", estoque: 11, preco: 8900 },
  { cor: "Branca", tamanho: "G", codigo: "TDF-CAM-BRA-G", estoque: 10, preco: 8900 },
  { cor: "Branca", tamanho: "GG", codigo: "TDF-CAM-BRA-GG", estoque: 4, preco: 9400 },
];

/* -------------------------------------------------------------------- pedidos */

export type StatusPagamento = "pago" | "aguardando" | "cancelado";
export type StatusEnvio = "separando" | "enviado" | "entregue" | "cancelado";

export type ItemPedido = { nome: string; variacao?: string; qtd: number; preco: number };

export type Pedido = {
  numero: string;
  cliente: string;
  cidade: string;
  data: string;
  itens: ItemPedido[];
  frete: number;
  transportadora: string;
  rastreio?: string;
  pagamento: StatusPagamento;
  metodoPagamento: string;
  envio: StatusEnvio;
  endereco: string;
  notaFiscal?: string;
};

/** Nomes e endereços inventados. Nenhuma correspondência com pessoa real. */
export const PEDIDOS: Pedido[] = [
  {
    numero: "1042", cliente: "Ricardo Almeida", cidade: "Petrópolis, RJ", data: "2026-09-09",
    itens: [{ nome: "Camiseta The Dark Film Preta", variacao: "Preta, G", qtd: 2, preco: 8900 }],
    frete: 2490, transportadora: "Correios PAC", rastreio: "AA123456789BR",
    pagamento: "pago", metodoPagamento: "Pix", envio: "enviado",
    endereco: "Rua das Palmeiras, 210, Centro, Petrópolis, RJ, 25680-000",
    notaFiscal: "000.001.042",
  },
  {
    numero: "1041", cliente: "Marina Costa", cidade: "Teresópolis, RJ", data: "2026-09-09",
    itens: [
      { nome: "Caneca The Dark Film Vermelha", qtd: 1, preco: 4900 },
      { nome: "Caneca The Dark Film Preta", qtd: 1, preco: 4900 },
    ],
    frete: 2190, transportadora: "Correios SEDEX", rastreio: "AA987654321BR",
    pagamento: "pago", metodoPagamento: "Cartão de crédito, 2x", envio: "entregue",
    endereco: "Av. Delfim Moreira, 88, Alto, Teresópolis, RJ, 25953-000",
    notaFiscal: "000.001.041",
  },
  {
    numero: "1040", cliente: "Eduardo Nunes", cidade: "Rio de Janeiro, RJ", data: "2026-09-08",
    itens: [{ nome: "Subwoofer", qtd: 1, preco: 39900 }],
    frete: 3890, transportadora: "Jadlog", rastreio: "JD4455667788",
    pagamento: "pago", metodoPagamento: "Cartão de crédito, 6x", envio: "enviado",
    endereco: "Rua Barata Ribeiro, 500, Copacabana, Rio de Janeiro, RJ, 22040-002",
    notaFiscal: "000.001.040",
  },
  {
    numero: "1039", cliente: "Patrícia Loureiro", cidade: "Juiz de Fora, MG", data: "2026-09-08",
    itens: [
      { nome: "Lâmpadas Crystal Vision", qtd: 1, preco: 12900 },
      { nome: "Buzinas esportivas", qtd: 1, preco: 8900 },
    ],
    frete: 2790, transportadora: "Correios PAC",
    pagamento: "aguardando", metodoPagamento: "Boleto", envio: "separando",
    endereco: "Rua Halfeld, 1020, Centro, Juiz de Fora, MG, 36010-003",
  },
  {
    numero: "1038", cliente: "Fernando Braga", cidade: "Petrópolis, RJ", data: "2026-09-07",
    itens: [{ nome: "Bateria Moura", qtd: 1, preco: 54900 }],
    frete: 0, transportadora: "Retirada na loja",
    pagamento: "pago", metodoPagamento: "Pix", envio: "entregue",
    endereco: "Retirada na loja, Rua Cel. Veiga, 1767, Petrópolis, RJ",
    notaFiscal: "000.001.038",
  },
  {
    numero: "1037", cliente: "Camila Ferraz", cidade: "Niterói, RJ", data: "2026-09-07",
    itens: [{ nome: "Camiseta The Dark Film Branca", variacao: "Branca, M", qtd: 1, preco: 8900 }],
    frete: 2290, transportadora: "Correios PAC", rastreio: "AA556677889BR",
    pagamento: "pago", metodoPagamento: "Pix", envio: "entregue",
    endereco: "Rua Gavião Peixoto, 145, Icaraí, Niterói, RJ, 24230-100",
    notaFiscal: "000.001.037",
  },
  {
    numero: "1036", cliente: "Gustavo Peixoto", cidade: "São Paulo, SP", data: "2026-09-06",
    itens: [
      { nome: "Tapetes BORCOL", qtd: 1, preco: 17900 },
      { nome: "Filtro de ar esportivo", qtd: 1, preco: 15900 },
    ],
    frete: 4190, transportadora: "Jadlog", rastreio: "JD1122334455",
    pagamento: "pago", metodoPagamento: "Cartão de crédito, 3x", envio: "enviado",
    endereco: "Rua Augusta, 2200, Consolação, São Paulo, SP, 01304-001",
    notaFiscal: "000.001.036",
  },
  {
    numero: "1035", cliente: "Aline Rodrigues", cidade: "Belo Horizonte, MG", data: "2026-09-05",
    itens: [{ nome: "Caneca The Dark Film Preta", qtd: 3, preco: 4900 }],
    frete: 3290, transportadora: "Correios PAC",
    pagamento: "cancelado", metodoPagamento: "Cartão de crédito", envio: "cancelado",
    endereco: "Rua da Bahia, 1500, Centro, Belo Horizonte, MG, 30160-011",
  },
  {
    numero: "1034", cliente: "Thiago Menezes", cidade: "Petrópolis, RJ", data: "2026-09-05",
    itens: [
      { nome: "Faróis de LED", qtd: 1, preco: 24900 },
      { nome: "Camiseta The Dark Film Preta", variacao: "Preta, GG", qtd: 1, preco: 9400 },
    ],
    frete: 0, transportadora: "Retirada na loja",
    pagamento: "pago", metodoPagamento: "Pix", envio: "entregue",
    endereco: "Retirada na loja, Rua Cel. Veiga, 1767, Petrópolis, RJ",
    notaFiscal: "000.001.034",
  },
  {
    numero: "1033", cliente: "Beatriz Sampaio", cidade: "Vitória, ES", data: "2026-09-04",
    itens: [{ nome: "Capa para estepe", qtd: 1, preco: 13900 }],
    frete: 3590, transportadora: "Correios SEDEX", rastreio: "AA334455667BR",
    pagamento: "pago", metodoPagamento: "Cartão de crédito, 2x", envio: "entregue",
    endereco: "Rua Sete de Setembro, 300, Centro, Vitória, ES, 29015-000",
    notaFiscal: "000.001.033",
  },
  {
    numero: "1032", cliente: "Leandro Vasques", cidade: "Curitiba, PR", data: "2026-09-03",
    itens: [{ nome: "Camiseta The Dark Film Preta", variacao: "Preta, M", qtd: 1, preco: 8900 }],
    frete: 2890, transportadora: "Correios PAC",
    pagamento: "aguardando", metodoPagamento: "Boleto", envio: "separando",
    endereco: "Av. Batel, 1750, Batel, Curitiba, PR, 80420-090",
  },
];

export function totalPedido(p: Pedido) {
  return p.itens.reduce((s, i) => s + i.qtd * i.preco, 0) + p.frete;
}

/* --------------------------------------------------------------------- cupons */

export type Cupom = {
  codigo: string;
  tipo: "percentual" | "valor";
  valor: number;
  validade: string;
  usos: number;
  limite: number;
  ativo: boolean;
};

export const CUPONS: Cupom[] = [
  { codigo: "PRIMEIRACOMPRA", tipo: "percentual", valor: 10, validade: "2026-12-31", usos: 34, limite: 200, ativo: true },
  { codigo: "FRETEGRATIS", tipo: "valor", valor: 2500, validade: "2026-10-31", usos: 12, limite: 50, ativo: true },
  { codigo: "OFICINA15", tipo: "percentual", valor: 15, validade: "2026-09-30", usos: 47, limite: 50, ativo: true },
  { codigo: "NATAL2025", tipo: "percentual", valor: 20, validade: "2025-12-25", usos: 88, limite: 100, ativo: false },
];

/* --------------------------------------------------------------------- vendas */

/**
 * Resumo de vendas. Só o que a proposta prevê: faturamento de hoje, da semana e do mês, ticket
 * médio e os produtos que mais saíram. Nada além disso, porque o que aparece na tela o cliente
 * considera contratado.
 */
export const VENDAS = {
  hoje: { valor: 27680, pedidos: 3 },
  semana: { valor: 184320, pedidos: 17 },
  mes: { valor: 742150, pedidos: 68 },
  ticketMedio: 10914,
};

export const MAIS_VENDIDOS = [
  { nome: "Camiseta The Dark Film Preta", qtd: 42, valor: 375800 },
  { nome: "Caneca The Dark Film Preta", qtd: 38, valor: 186200 },
  { nome: "Lâmpadas Crystal Vision", qtd: 21, valor: 270900 },
  { nome: "Camiseta The Dark Film Branca", qtd: 19, valor: 169100 },
  { nome: "Faróis de LED", qtd: 11, valor: 273900 },
];

/** Faturamento por dia da semana, para a barra do resumo. */
export const POR_DIA = [
  { dia: "Seg", valor: 21400 },
  { dia: "Ter", valor: 33800 },
  { dia: "Qua", valor: 18900 },
  { dia: "Qui", valor: 41200 },
  { dia: "Sex", valor: 36700 },
  { dia: "Sáb", valor: 24650 },
  { dia: "Dom", valor: 7670 },
];

export function dataBr(iso: string) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}
