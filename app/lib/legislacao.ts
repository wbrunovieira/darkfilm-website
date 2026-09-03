/**
 * Limites legais de transmissão luminosa — fonte única do site.
 *
 * Existe porque os mesmos números já estavam escritos em três lugares diferentes
 * (o simulador, a tabela da página /simulador e uma imagem JPG na página de películas
 * automotivas) e saíram de sincronia: a imagem continuou estampando 75% no para-brisa
 * e 28% nos vidros de trás, valores da resolução antiga, depois que o texto já tinha
 * sido corrigido. Qualquer número novo entra aqui e só aqui.
 *
 * Conferido no texto oficial em 03/09/2026 (PDF do gov.br, não fonte secundária):
 * Resolução CONTRAN 960/2022, art. 4º, com a redação dada pela Resolução 989/2022.
 * - inciso I: mínimo de 70% para o para-brisa E para as demais áreas indispensáveis à
 *   dirigibilidade, que o §1º define como o para-brisa e as laterais DIANTEIRAS;
 * - inciso II (redação da 989/2022): pode ser inferior a isso nos vidros que não
 *   interferem nessas áreas, desde que o veículo tenha retrovisores externos dos dois
 *   lados. O mínimo de 28% da redação original deixou de existir;
 * - art. 10, I: películas refletivas são vedadas em qualquer área.
 *
 * A lei mede o CONJUNTO vidro + película, não a película sozinha.
 */

export type VidroId = "parabrisa" | "dianteiras" | "traseiras";

export type LimiteVidro = {
  id: VidroId;
  /** Nome longo, para a lista de escolha do simulador. */
  nome: string;
  /** Nome curto, para tabelas e legendas. */
  curto: string;
  /** Frase com preposição: "nos vidros da frente". */
  em: string;
  /** Frase com "para": "para os vidros da frente". */
  para: string;
  /** Mínimo de transmissão luminosa em %, ou null quando a lei não define. */
  min: number | null;
};

export const LIMITES: LimiteVidro[] = [
  {
    id: "dianteiras",
    nome: "Vidros da frente (motorista e carona)",
    curto: "Laterais dianteiras",
    em: "nos vidros da frente",
    para: "para os vidros da frente",
    min: 70,
  },
  {
    id: "traseiras",
    nome: "Vidros de trás (portas traseiras e vidro traseiro)",
    curto: "Traseiros e vidro de trás",
    em: "nos vidros de trás",
    para: "para os vidros de trás",
    min: null,
  },
  {
    id: "parabrisa",
    nome: "Para-brisa",
    curto: "Para-brisa",
    em: "no para-brisa",
    para: "para o para-brisa",
    min: 70,
  },
];

/** Como o valor aparece em tabela e legenda: "70%" ou "Livre". */
export function valorLimite(l: LimiteVidro) {
  return l.min === null ? "Livre" : `${l.min}%`;
}

/** Frase completa para o item da lista: "Mínimo de 70% de transmissão luminosa". */
export function rotuloLimite(l: LimiteVidro) {
  return l.min === null
    ? "Sem mínimo obrigatório"
    : `Mínimo de ${l.min}% de transmissão luminosa`;
}

export const NOTA_CONJUNTO = "mínimo de transmissão luminosa do conjunto vidro + película";
export const NOTA_SEM_MINIMO =
  "sem mínimo, desde que o veículo tenha retrovisores externos dos dois lados";
export const REFERENCIA = "Resolução CONTRAN 960/2022, alterada pela 989/2022";
