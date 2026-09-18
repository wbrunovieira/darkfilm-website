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
import { r2Configurado, r2Gravar, r2Ler } from "./r2";

export const AUTORES = [
  "Bruno The Dark Film",
  "Michele The Dark Film",
  "Bruno WB Digital Solutions",
] as const;
export type Autor = (typeof AUTORES)[number];

/** De que lado da mesa cada pessoa senta. Decide de quem é a bola a cada evento. */
export type Lado = "cliente" | "agencia";
export const LADO: Record<Autor, Lado> = {
  "Bruno The Dark Film": "cliente",
  "Michele The Dark Film": "cliente",
  "Bruno WB Digital Solutions": "agencia",
};

/**
 * Cada item é uma conversa, e os dois lados falam.
 *
 * O pedido vem de qualquer direção: o cliente pede uma mudança, ou a agência pede material
 * ("preciso de uma foto melhor nesta seção") e o cliente responde ("foto tal, no Drive").
 * Por isso a situação de um item não é sobre aprovação — é sobre **de quem é a bola**:
 *
 *   amarelo = com o cliente · vermelho = com a agência · verde = fechado
 *
 * Uma regra só, que vale nos dois sentidos e deixa a lista legível para os dois.
 *
 * Duas travas continuam:
 * - **A aprovação do conteúdo é sempre do cliente.** Mesmo quando foi a agência que abriu o
 *   pedido e entregou, o item volta para ele dizer se ficou bom.
 * - **O agradecimento é da agência**, e é o que fecha. Enquanto ele não vem, a aprovação é
 *   afirmação de um lado só e o cliente desfaz sem atrito — na revisão se clica errado e se
 *   muda de ideia depois de ver outra página.
 *
 * Nada apaga nada: desfazer e reabrir são eventos novos por cima. O histórico guarda a
 * sequência inteira, que é justamente o que se perde no WhatsApp.
 */
export type Acao =
  /** Abre um item avulso, fora das páginas do site (o `texto` é o título). */
  | "criado"
  /** Pede alguma coisa — de qualquer um dos lados. */
  | "alteracao"
  /** Responde sem mudar de fase; a bola passa para o outro lado. */
  | "resposta"
  /** A agência diz que fez; volta para o cliente conferir. */
  | "ajustado"
  /** O cliente aprova o conteúdo. */
  | "aprovado"
  /** O cliente desfaz a própria aprovação, enquanto ninguém agradeceu. */
  | "desfeito"
  /** A agência agradece e fecha. */
  | "confirmado";

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
  /**
   * De onde veio o registro. Ausente = digitado no painel, com IP de verdade.
   * `whatsapp` = pedido que o cliente mandou por lá antes de a ferramenta existir, transcrito
   * daqui para ele não ter de reescrever tudo. `interno` = a nossa resposta, registrada por nós
   * para o assunto ficar fechado no mesmo lugar. Nenhum dos dois finge ter passado pelo painel.
   */
  origem?: "whatsapp" | "interno";
  /**
   * Id do evento que esta fala responde.
   *
   * Sem isto a conversa de uma seção era uma pilha corrida: três pedidos dele seguidos e duas
   * respostas nossas no fim, sem dizer qual respondia qual. Ele pediu em 18/09/2026 para ver
   * cada pedido já com a resposta dele junto, e poder responder ali mesmo.
   *
   * Opcional de propósito: tudo que foi registrado antes disto não tem vínculo, e continua
   * válido — aparece na linha do tempo, como sempre apareceu.
   */
  respondeA?: string;
};

const PASTA = "revisao/eventos/";

/**
 * Consolidado: todos os eventos num arquivo só.
 *
 * **Por que existe.** O registro nasceu com um arquivo por evento, o que está certo para gravar
 * (append-only de verdade, sem corrida entre quem escreve) e é péssimo para ler: `list` e `get`
 * privado contam como operação avançada do Blob, e o plano gratuito dá 2.000 por mês **para a
 * conta inteira**. Com 51 eventos, uma visita à página custava 52 operações. Trinta e oito visitas
 * queimavam a cota do mês e suspendiam todos os armazenamentos da conta, inclusive os de outros
 * clientes. Foi o que aconteceu em 16/09/2026.
 *
 * Com o consolidado, a leitura passa a custar duas operações, independente de haver 51 eventos ou
 * 5.000: uma para ler este arquivo e uma para listar e conferir se sobrou algo fora dele.
 *
 * **Os arquivos por evento continuam existindo.** Este é um resumo, não um substituto: a escrita
 * segue criando um arquivo por evento e depois reescrevendo este. Se o consolidado sumir, ficar
 * velho ou vier corrompido, a leitura volta sozinha a montar tudo pelos arquivos originais. É
 * lento e caro, mas nunca perde evento, que é o que importa num registro de auditoria.
 */
const CONSOLIDADO = "revisao/registro.json";

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
  // Um arquivo por evento: append-only de verdade, sem corrida entre quem grava ao mesmo tempo.
  await Promise.all(
    eventos.map((evento) =>
      r2Configurado()
        ? r2Gravar(`${PASTA}${evento.id}.json`, JSON.stringify(evento))
        : put(`${PASTA}${evento.id}.json`, JSON.stringify(evento), {
            // Privado: um registro de auditoria não pode ser lido por quem descobrir a URL.
            access: "private",
            contentType: "application/json",
            // o nome já é único; sem isto o Blob acrescenta sufixo e o id deixa de bater
            addRandomSuffix: false,
          }),
    ),
  );

  /**
   * Atualiza o resumo depois de gravar, para a próxima leitura custar duas operações.
   *
   * Vai em `try` de propósito: o evento JÁ está salvo nos arquivos acima, que é o que não pode
   * falhar. Se o resumo não puder ser reescrito — Blob suspenso, rede caindo — a leitura seguinte
   * apenas monta tudo pelos arquivos originais, cara mas correta. Derrubar a requisição aqui seria
   * dizer ao cliente que o pedido dele não foi registrado quando foi.
   */
  try {
    /**
     * O consolidado é reescrito com o que já havia MAIS o que acabou de ser criado.
     *
     * `lerEventos` devolve o consolidado antigo, que por definição ainda não conhece estes
     * eventos. Sem juntar aqui, a regravação devolveria a lista anterior e apagaria do resumo o
     * evento recém-gravado, que continuaria existindo só no arquivo individual. O `filter` evita
     * duplicar caso a leitura já os enxergue por algum caminho de reserva.
     */
    const anteriores = await lerEventos();
    const novosIds = new Set(eventos.map((e) => e.id));
    await regravarConsolidado([...anteriores.filter((e) => !novosIds.has(e.id)), ...eventos]);
  } catch (e) {
    console.error("[revisao] evento gravado, mas o consolidado não pôde ser atualizado", e);
  }

  return eventos;
}

/**
 * Quantos eventos existem, sem ler nenhum.
 *
 * `lerEventos` faz um `get` por evento, hoje algumas dezenas e crescendo. Para a tela só
 * perguntar "mudou alguma coisa?" isso seria caro à toa: o `list` já devolve os nomes, e o id
 * começa com o instante, então contar e olhar o último nome basta.
 *
 * Uma operação de Blob em vez de uma por evento.
 */
export async function contarEventos(): Promise<{ total: number; ultimo: string | null }> {
  // No R2, o consolidado já responde as duas perguntas numa leitura só, sem listar o diretório.
  if (r2Configurado()) {
    const cru = await r2Ler(CONSOLIDADO);
    if (cru) {
      const dados = JSON.parse(cru) as Evento[];
      if (Array.isArray(dados)) {
        const ids = dados.map((e) => e.id).sort();
        return { total: dados.length, ultimo: ids[ids.length - 1] ?? null };
      }
    }
  }

  let total = 0;
  let ultimo: string | null = null;
  let cursor: string | undefined;
  do {
    const r = await list({ prefix: PASTA, cursor, limit: 1000 });
    total += r.blobs.length;
    for (const b of r.blobs) {
      const id = b.pathname.slice(PASTA.length).replace(/\.json$/, "");
      if (!ultimo || id > ultimo) ultimo = id;
    }
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return { total, ultimo };
}

/** Um evento pelo caminho do arquivo. `useCache: false` porque o CDN devolveria a versão anterior. */
async function lerUm(pathname: string): Promise<Evento | null> {
  const r = await get(pathname, { access: "private", useCache: false });
  if (!r?.stream) return null;
  return (await new Response(r.stream).json()) as Evento;
}

/** Só os nomes, sem abrir nada. Uma operação por página de 1.000. */
async function listarCaminhos(): Promise<string[]> {
  const nomes: string[] = [];
  let cursor: string | undefined;
  do {
    const r = await list({ prefix: PASTA, cursor, limit: 1000 });
    nomes.push(...r.blobs.map((b) => b.pathname));
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return nomes;
}

/** O consolidado, ou null quando ainda não existe, está corrompido ou o Blob recusa. */
async function lerConsolidado(): Promise<Evento[] | null> {
  try {
    const r = await get(CONSOLIDADO, { access: "private", useCache: false });
    if (!r?.stream) return null;
    const dados = await new Response(r.stream).json();
    return Array.isArray(dados) ? (dados as Evento[]) : null;
  } catch {
    return null;
  }
}

export async function lerEventos(): Promise<Evento[]> {
  /**
   * Caminho normal: uma leitura no R2 e acabou.
   *
   * O registro inteiro cabe num arquivo (51 eventos dão 47 KB). Ler um objeto no R2 é uma
   * operação Classe B, e o plano gratuito dá 10 milhões por mês. O Vercel Blob dava 2.000
   * operações avançadas por mês para a conta inteira, e foi por isso que suspendeu tudo em
   * 16/09/2026.
   */
  if (r2Configurado()) {
    const cru = await r2Ler(CONSOLIDADO);
    if (cru) {
      const dados = JSON.parse(cru);
      if (Array.isArray(dados)) return (dados as Evento[]).sort(porData);
    }
  }

  // Reserva: o caminho antigo, pelo Vercel Blob. Fica porque é o que garante que um R2 mal
  // configurado não apague a história da tela; devolve vazio em vez de derrubar a página.
  // 1ª operação: o consolidado. Cobre tudo que existia quando ele foi escrito.
  const base = (await lerConsolidado()) ?? [];
  const jaTenho = new Set(base.map((e) => e.id));

  // 2ª operação: a lista de nomes, para descobrir o que entrou depois dele.
  // É aqui que a segurança mora: se o consolidado estiver velho ou não existir, os arquivos
  // originais aparecem nesta lista e são lidos normalmente. Nenhum evento se perde por
  // depender do resumo.
  const caminhos = await listarCaminhos();
  const faltando = caminhos.filter(
    (c) => !jaTenho.has(c.slice(PASTA.length).replace(/\.json$/, "")),
  );

  // Em regime normal isto é zero: a gravação reescreve o consolidado logo depois de criar os
  // arquivos. Só há leitura extra quando uma gravação anterior não conseguiu atualizar o resumo.
  const novos = (await Promise.all(faltando.map(lerUm))).filter((x): x is Evento => !!x);

  return [...base, ...novos].sort(porData);
}

/**
 * Reescreve o consolidado a partir da lista completa.
 *
 * Só ACRESCENTA um arquivo: nunca apaga nem altera os arquivos por evento. Se falhar, o registro
 * continua íntegro e a leitura só fica cara de novo. Por isso o chamador engole o erro.
 */
export async function regravarConsolidado(eventos: Evento[]): Promise<void> {
  if (r2Configurado()) {
    await r2Gravar(CONSOLIDADO, JSON.stringify(eventos.sort(porData)));
    return;
  }
  await put(CONSOLIDADO, JSON.stringify(eventos.sort(porData)), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export type Situacao =
  /**
   * Cinza: ninguém tocou neste item ainda. É o padrão, e por isso precisa ser SILENCIOSO —
   * quando "não olhei" e "estão esperando você responder" tinham a mesma cor, a cor deixava
   * de significar qualquer coisa e a tela virava 55 cartões iguais.
   */
  | "novo"
  /** Amarelo: há conversa aberta e a bola está com o cliente. */
  | "com-cliente"
  /** Vermelho: a bola está com a agência. */
  | "com-agencia"
  /** Verde claro: o cliente aprovou, falta a agência agradecer. */
  | "aprovado"
  /** Verde cheio: fechado por acordo. */
  | "fechado";

/** De quem fica a bola depois de um evento. Vale sempre a última palavra. */
export function situacaoApos(e: Evento): Situacao {
  const outroLado = LADO[e.autor] === "cliente" ? "com-agencia" : "com-cliente";
  switch (e.acao) {
    case "confirmado":
      return "fechado";
    case "aprovado":
      return "aprovado";
    case "ajustado":
      return "com-cliente";
    case "desfeito":
      return "com-cliente";
    // pedir, responder e criar sempre passam a bola para quem não falou
    default:
      return outroLado;
  }
}

/**
 * Situação de cada item, no formato `paginaId/secaoId`. Itens nunca tocados ficam com o
 * cliente: é ele quem tem de revisar.
 */
export function reduzir(eventos: Evento[]): Record<string, Situacao> {
  const mapa: Record<string, Situacao> = {};
  for (const e of eventos) {
    if (!e.secaoId) continue;
    mapa[`${e.paginaId}/${e.secaoId}`] = situacaoApos(e);
  }
  return mapa;
}

/** Página sintética dos itens que não pertencem a nenhuma página do site. */
export const PAGINA_PENDENCIAS = "pendencias-gerais";

/** Itens avulsos abertos pela ferramenta, na ordem em que foram criados. */
export function pendenciasGerais(eventos: Evento[]) {
  return eventos
    .filter((e) => e.paginaId === PAGINA_PENDENCIAS && e.acao === "criado" && e.secaoId)
    .map((e) => ({ id: e.secaoId as string, titulo: e.texto ?? "(sem título)", em: e.em, autor: e.autor }));
}

/** Quem pode agradecer. Trava contra clique errado — não é autenticação. */
export const AUTOR_AGENCIA: Autor = "Bruno WB Digital Solutions";
