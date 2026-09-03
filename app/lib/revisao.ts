/**
 * Registro de revisão do cliente — log append-only em Vercel Blob.
 *
 * **Por que não um banco:** não há relação nem consulta a fazer; o que se quer é prova de que
 * alguém aprovou algo numa data. Um log de eventos imutáveis é a forma mais simples disso, e a
 * mais forte: nada é editado nem apagado, então o histórico não depende de confiar no estado
 * final. O estado atual é derivado — a última palavra sobre cada item vence.
 *
 * **Por que não um arquivo JSON único:** dois cliques simultâneos se sobrescreveriam e um
 * registro sumiria. Um arquivo por evento não tem escrita concorrente.
 *
 * **Por que não JSON em disco:** o sistema de arquivos do Vercel é efêmero — o registro sumiria
 * no deploy seguinte, e cada instância teria a sua cópia.
 *
 * **Hora e IP são do servidor.** Se viessem do navegador, a hora seria o relógio da máquina de
 * quem aprova, que se muda em dois cliques. Aqui a data é carimbada por quem recebe, e o IP sai
 * do cabeçalho da requisição — sem depender de serviço externo nenhum.
 */

import { get, list, put } from "@vercel/blob";

export const AUTORES = [
  "Bruno The Dark Film",
  "Michele The Dark Film",
  "Bruno WB Digital Solutions",
] as const;
export type Autor = (typeof AUTORES)[number];

/**
 * O ciclo de um item:
 *
 *   pendente ──aprovado──▶ aprovado ──confirmado──▶ confirmado
 *      ▲            │           │                        │
 *      └─desfeito───┘           └────alteracao───────────┘
 *                                          │
 *                                     ajustado ──▶ (volta a pendente para o cliente)
 *
 * `desfeito` existe porque, enquanto ninguém agradeceu, a aprovação é afirmação de um lado só:
 * o cliente clica errado ou muda de ideia depois de ver outra página, e desfazer tem que ser
 * sem atrito. Depois do `confirmado` o assunto foi fechado por acordo — o desfazer some, mas
 * `alteracao` continua disponível, e reabrir fica registrado como reabertura.
 *
 * Nada disso apaga nada: desfazer é um evento novo por cima. O histórico guarda a sequência
 * inteira, que é justamente o que se perde no WhatsApp.
 */
export type Acao = "aprovado" | "desfeito" | "confirmado" | "alteracao" | "ajustado";

export type Evento = {
  id: string;
  paginaId: string;
  /** `null` quando o comentário ou a aprovação é da página inteira. */
  secaoId: string | null;
  acao: Acao;
  autor: Autor;
  texto?: string;
  /** ISO 8601, carimbado pelo servidor. */
  em: string;
  ip: string;
  userAgent: string;
};

const PASTA = "revisao/eventos/";

/** Ordena por data; empate desempata pelo id, que carrega o instante e um sufixo aleatório. */
function porData(a: Evento, b: Evento) {
  return a.em === b.em ? a.id.localeCompare(b.id) : a.em.localeCompare(b.em);
}

/** Item que representa a página inteira, para comentários e status que não são de uma seção. */
export const ITEM_PAGINA = "__pagina";

export async function gravarEventos(
  entradas: Omit<Evento, "id" | "em">[],
): Promise<Evento[]> {
  // Mesmo carimbo de tempo para tudo que veio do mesmo clique — aprovar uma página é um ato só.
  const em = new Date().toISOString();
  const base = em.replace(/[:.]/g, "-");
  const eventos = entradas.map((e, i) => ({
    ...e,
    em,
    id: `${base}-${String(i).padStart(2, "0")}-${Math.random().toString(36).slice(2, 8)}`,
  }));
  await Promise.all(
    eventos.map((evento) =>
      put(`${PASTA}${evento.id}.json`, JSON.stringify(evento), {
        // Privado: um registro de auditoria não pode ser lido por quem descobrir a URL.
        access: "private",
        contentType: "application/json",
        // o nome já é único; sem isto o Blob acrescenta sufixo e o id do arquivo deixa de bater
        addRandomSuffix: false,
      }),
    ),
  );
  return eventos;
}

export async function lerEventos(): Promise<Evento[]> {
  const eventos: Evento[] = [];
  let cursor: string | undefined;
  do {
    const r = await list({ prefix: PASTA, cursor, limit: 1000 });
    const lote = await Promise.all(
      r.blobs.map(async (b) => {
        // `useCache: false` porque o registro acabou de mudar quando alguém clica: ler do CDN
        // devolveria a versão anterior e a tela pareceria não ter registrado nada.
        const r = await get(b.pathname, { access: "private", useCache: false });
        if (!r?.stream) return null;
        return (await new Response(r.stream).json()) as Evento;
      }),
    );
    eventos.push(...lote.filter((x): x is Evento => !!x));
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return eventos.sort(porData);
}

export type Situacao = "pendente" | "aprovado" | "confirmado" | "alteracao" | "ajustado";

/**
 * Situação de cada item, no formato `paginaId/secaoId`. Vale sempre a última palavra — inclusive
 * quando ela reabre algo já confirmado.
 */
export function reduzir(eventos: Evento[]): Record<string, Situacao> {
  const mapa: Record<string, Situacao> = {};
  for (const e of eventos) {
    if (!e.secaoId) continue;
    mapa[`${e.paginaId}/${e.secaoId}`] = e.acao === "desfeito" ? "pendente" : e.acao;
  }
  return mapa;
}

/** Quem pode agradecer. Trava contra clique errado — não é autenticação. */
export const AUTOR_AGENCIA: Autor = "Bruno WB Digital Solutions";
