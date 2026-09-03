"use client";

import { useCallback, useMemo, useState } from "react";
import { paginasRevisao, type PaginaRevisao, type SecaoRevisao } from "@/content/revisao";
import {
  AUTORES,
  AUTOR_AGENCIA,
  ITEM_PAGINA,
  LADO,
  PAGINA_PENDENCIAS,
  pendenciasGerais,
  type Autor,
  type Evento,
  type Situacao,
} from "@/lib/revisao";

/** amarelo = com o cliente · vermelho = com a agência · verde = fechado */
export const NOME_CLIENTE = "The Dark Film";
export const NOME_AGENCIA = "WB Digital Solutions";

const ROTULO: Record<Situacao, string> = {
  "com-cliente": `Com a ${NOME_CLIENTE}`,
  "com-agencia": `Com a ${NOME_AGENCIA}`,
  aprovado: "Aprovado — aguardando a WB",
  fechado: "Fechado",
};
const COR: Record<Situacao, string> = {
  "com-cliente": "bg-amber-100 text-amber-900 ring-amber-300",
  "com-agencia": "bg-red-100 text-red-900 ring-red-300",
  aprovado: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  fechado: "bg-emerald-600 text-white ring-emerald-600",
};
const PONTO: Record<Situacao, string> = {
  "com-cliente": "bg-amber-400",
  "com-agencia": "bg-red-500",
  aprovado: "bg-emerald-400",
  fechado: "bg-emerald-600",
};

const VERBO: Record<string, string> = {
  criado: "abriu",
  alteracao: "pediu",
  resposta: "respondeu",
  ajustado: "marcou como feito",
  aprovado: "aprovou",
  desfeito: "desfez a aprovação",
  confirmado: "confirmou e agradeceu",
};

type Filtro = "tudo" | "com-cliente" | "com-agencia" | "aprovado" | "fechado";

function quando(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

type Item = SecaoRevisao;
type Bloco = { id: string; titulo: string; href?: string; grupo: string; itens: Item[] };

export function PainelRevisao({
  eventosIniciais,
  situacoesIniciais,
}: {
  eventosIniciais: Evento[];
  situacoesIniciais: Record<string, Situacao>;
}) {
  const [eventos, setEventos] = useState(eventosIniciais);
  const [situacoes, setSituacoes] = useState(situacoesIniciais);
  const [autor, setAutor] = useState<Autor>(AUTORES[0]);
  const [filtro, setFiltro] = useState<Filtro>("tudo");
  const [aberta, setAberta] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [escrevendo, setEscrevendo] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState("");
  const [novaPendencia, setNovaPendencia] = useState(false);

  const souAgencia = LADO[autor] === "agencia";

  const sit = useCallback(
    (paginaId: string, itemId: string): Situacao =>
      situacoes[`${paginaId}/${itemId}`] ?? "com-cliente",
    [situacoes],
  );

  const registrar = useCallback(
    async (paginaId: string, secaoId: string | null, acao: string, texto?: string) => {
      const chave = `${paginaId}/${secaoId ?? "pagina"}/${acao}`;
      setOcupado(chave);
      setErro(null);
      try {
        const r = await fetch("/api/revisao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paginaId, secaoId, acao, autor, texto }),
        });
        const dados = await r.json();
        if (!r.ok) throw new Error(dados?.erro ?? "não foi possível registrar");
        const novos: Evento[] = dados.eventos;
        setEventos((e) => [...e, ...novos]);
        setSituacoes((s) => {
          const m = { ...s };
          for (const ev of novos) {
            if (!ev.secaoId) continue;
            const outro = LADO[ev.autor] === "cliente" ? "com-agencia" : "com-cliente";
            m[`${ev.paginaId}/${ev.secaoId}`] =
              ev.acao === "confirmado"
                ? "fechado"
                : ev.acao === "aprovado"
                  ? "aprovado"
                  : ev.acao === "ajustado" || ev.acao === "desfeito"
                    ? "com-cliente"
                    : (outro as Situacao);
          }
          return m;
        });
        setEscrevendo(null);
        setRascunho("");
        setNovaPendencia(false);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "não foi possível registrar");
      } finally {
        setOcupado(null);
      }
    },
    [autor],
  );

  const historico = useCallback(
    (paginaId: string, itemId: string) =>
      eventos.filter((e) => e.paginaId === paginaId && e.secaoId === itemId),
    [eventos],
  );

  /** Blocos = páginas do site + as pendências avulsas abertas aqui dentro. */
  const blocos: Bloco[] = useMemo(() => {
    const pend = pendenciasGerais(eventos);
    const dasPaginas = paginasRevisao.map((p) => ({
      id: p.id,
      titulo: p.titulo,
      href: p.href,
      grupo: p.grupo,
      itens: p.secoes,
    }));
    return pend.length
      ? [
          {
            id: PAGINA_PENDENCIAS,
            titulo: "Pendências gerais",
            grupo: "Pendências gerais",
            itens: pend.map((x) => ({ id: x.id, titulo: x.titulo })),
          },
          ...dasPaginas,
        ]
      : dasPaginas;
  }, [eventos]);

  /** O pior estado manda: uma bola com a agência deixa a página vermelha na lista. */
  const sitBloco = useCallback(
    (b: Bloco): Situacao => {
      const itens = [...b.itens.map((i) => sit(b.id, i.id)), sit(b.id, ITEM_PAGINA)];
      if (itens.includes("com-agencia")) return "com-agencia";
      // `itens` e não `b.itens`: um pedido sobre a página inteira também deixa a página pendente.
      // Sem isto o cartão ficava verde com uma pergunta aberta dentro, e ninguém a via.
      if (itens.includes("com-cliente")) return "com-cliente";
      return b.itens.every((i) => sit(b.id, i.id) === "fechado") ? "fechado" : "aprovado";
    },
    [sit],
  );

  /**
   * A conta é de PÁGINAS, não de itens. "0 de 105 itens" desanima antes de começar — parece uma
   * montanha. São 55 páginas, e a maioria (as de produto) se resolve num clique cada.
   */
  /**
   * `paginas` são só as páginas do site. A caixa de pendências avulsas é um bloco na mesma
   * lista, mas contá-la como página faria o total oscilar — "55 páginas" viraria 56 assim que
   * alguém abrisse uma pendência, e ninguém entende um total que muda sozinho.
   */
  const paginas = useMemo(() => blocos.filter((b) => !!b.href), [blocos]);
  const total = paginas.length;
  /** Contadas à parte: não são páginas do site e não podem mexer no total. */
  const avulsas = useMemo(
    () => blocos.find((b) => b.id === PAGINA_PENDENCIAS)?.itens.length ?? 0,
    [blocos],
  );
  const resolvidos = useMemo(
    () => paginas.filter((b) => ["aprovado", "fechado"].includes(sitBloco(b))).length,
    [paginas, sitBloco],
  );
  const meuLado: Situacao = souAgencia ? "com-agencia" : "com-cliente";
  const comAgencia = useMemo(
    () => blocos.filter((b) => sitBloco(b) === "com-agencia").length,
    [blocos, sitBloco],
  );
  /** O que está do lado de quem abriu a página — vale para o Bruno e para a Michele igual. */
  const doMeuLado = useMemo(
    () => blocos.filter((b) => sitBloco(b) === meuLado),
    [blocos, sitBloco, meuLado],
  );
  const comigo = doMeuLado.length;
  // páginas e pendências contadas à parte também aqui: misturar as duas foi o que gerou o "56"
  const minhasPags = useMemo(() => doMeuLado.filter((b) => !!b.href).length, [doMeuLado]);
  const minhasPend = useMemo(
    () => doMeuLado.find((b) => b.id === PAGINA_PENDENCIAS)?.itens.length ?? 0,
    [doMeuLado],
  );
  const minhasPaginas = useMemo(() => doMeuLado.slice(0, 8), [doMeuLado]);

  const visiveis = useMemo(
    () => blocos.filter((b) => filtro === "tudo" || sitBloco(b) === filtro),
    [blocos, filtro, sitBloco],
  );

  const grupos = useMemo(() => {
    const m = new Map<string, Bloco[]>();
    for (const b of visiveis) m.set(b.grupo, [...(m.get(b.grupo) ?? []), b]);
    return [...m.entries()];
  }, [visiveis]);

  const pct = total ? Math.round((resolvidos / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <header className="pt-10 sm:pt-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--wb-roxo-vivo)]">
          The Dark Film &amp; Sound
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--wb-roxo)] sm:text-4xl">
          Revisão do site novo
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Abra cada página, confira e aprove. Se algo precisar mudar — ou se faltar alguma coisa
          de qualquer um dos lados — escreva ali mesmo. Fica tudo registrado com data e autor, e
          ninguém precisa procurar no WhatsApp depois.
        </p>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-400" aria-hidden /> esperando a {NOME_CLIENTE}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500" aria-hidden /> esperando a {NOME_AGENCIA}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-600" aria-hidden /> fechado
          </span>
        </p>
      </header>

      <section aria-label="Progresso" className="wb-entra mt-8 rounded-2xl border border-[var(--wb-linha)] bg-white p-5 shadow-[0_10px_30px_-24px_rgba(53,5,69,0.5)]">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-lg font-semibold text-slate-900">
            {resolvidos} de {total} páginas resolvidas
            {avulsas > 0 && (
              <span className="font-normal text-slate-500">
                {" "}
                + {avulsas} {avulsas === 1 ? "pendência" : "pendências"}
              </span>
            )}
          </p>
          <p className="text-sm text-slate-500">
            {comAgencia > 0
              ? `${comAgencia} ${comAgencia === 1 ? "item está" : "itens estão"} com a ${NOME_AGENCIA}`
              : `Nada esperando a ${NOME_AGENCIA}`}
          </p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div className="wb-progresso h-full rounded-full transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section className="sticky top-0 z-20 -mx-4 mt-6 border-b border-[var(--wb-linha)] bg-[var(--wb-fundo)]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-700">Quem está escrevendo:</span>
            <select
              value={autor}
              onChange={(e) => setAutor(e.target.value as Autor)}
              className="min-h-9 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              {AUTORES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>

          <div role="group" aria-label="Filtrar" className="flex flex-wrap gap-1.5">
            {(
              [
                ["tudo", "Tudo"],
                ["com-cliente", `Com a ${NOME_CLIENTE}`],
                ["com-agencia", `Com a WB${comAgencia ? ` (${comAgencia})` : ""}`],
                ["aprovado", "Aprovadas"],
                ["fechado", "Fechadas"],
              ] as [Filtro, string][]
            ).map(([id, rot]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFiltro(id)}
                aria-pressed={filtro === id}
                className={`min-h-9 rounded-full px-3.5 text-sm font-medium transition-colors ${
                  filtro === id
                    ? "bg-[var(--wb-roxo)] text-white shadow-[0_6px_16px_-8px_rgba(53,5,69,0.8)]"
                    : "bg-white text-slate-600 ring-1 ring-[var(--wb-linha)] hover:text-[var(--wb-roxo)] hover:ring-[var(--wb-lilas)]"
                }`}
              >
                {rot}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => { setNovaPendencia(true); setRascunho(""); }}
            className="ml-auto min-h-9 rounded-lg bg-white px-3.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 transition-colors hover:bg-slate-100"
          >
            + Nova pendência
          </button>
        </div>

        {novaPendencia && (
          <div className="mt-3 rounded-lg border border-slate-300 bg-white p-3">
            <label className="block text-sm font-medium text-slate-700">
              Uma pendência que não é de nenhuma página — acesso, prazo, material, o que for.
            </label>
            <input
              value={rascunho}
              onChange={(e) => setRascunho(e.target.value)}
              autoFocus
              placeholder="Ex.: me adicionar como contato técnico no registro.br"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                disabled={!rascunho.trim() || ocupado?.endsWith("/criado")}
                onClick={() =>
                  registrar(PAGINA_PENDENCIAS, `p-${Date.now().toString(36)}`, "criado", rascunho)
                }
                className="min-h-9 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                Abrir pendência
              </button>
              <button type="button" onClick={() => setNovaPendencia(false)} className="min-h-9 px-3 text-sm text-slate-600">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>

      {/* O que está com quem abriu a página, logo no topo: sem isto ele rolaria 55 cartões para
          descobrir o que é dele. Some quando não há nada — não vale ocupar espaço com "nada". */}
      {minhasPaginas.length > 0 && (
        <section className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">
            Esperando a {souAgencia ? NOME_AGENCIA : NOME_CLIENTE}:{" "}
            {minhasPags > 0 && `${minhasPags} ${minhasPags === 1 ? "página" : "páginas"}`}
            {minhasPags > 0 && minhasPend > 0 && " e "}
            {minhasPend > 0 && `${minhasPend} ${minhasPend === 1 ? "pendência" : "pendências"}`}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {minhasPaginas.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => {
                    setAberta(b.id);
                    document.getElementById(`bloco-${b.id}`)?.scrollIntoView({ block: "center" });
                  }}
                  className="min-h-9 rounded-full bg-white px-3.5 text-sm font-medium text-amber-900 ring-1 ring-amber-300 transition-colors hover:bg-amber-100"
                >
                  {b.titulo}
                </button>
              </li>
            ))}
            {comigo > minhasPaginas.length && (
              <li className="self-center text-sm text-amber-800">
                e mais {comigo - minhasPaginas.length}
              </li>
            )}
          </ul>
        </section>
      )}

      {erro && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
          {erro}
        </p>
      )}

      {grupos.map(([grupo, itens]) => (
        <section key={grupo} className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            {grupo}{" "}
            <span className="font-normal normal-case tracking-normal text-slate-400">
              {grupo === "Pendências gerais"
                ? `— ${itens.length} ${itens.length === 1 ? "pendência" : "pendências"}`
                : `— ${itens.length} de ${total} páginas do site`}
            </span>
          </h2>

          <ul className="mt-3 space-y-3">
            {itens.map((b, i) => {
              const s = sitBloco(b);
              const abertoAgora = aberta === b.id || b.itens.length === 1 || b.id === PAGINA_PENDENCIAS;
              const chavePagina = `${b.id}/pagina`;
              return (
                <li
                  key={b.id}
                  id={`bloco-${b.id}`}
                  style={{ "--i": i } as React.CSSProperties}
                  className="wb-entra wb-cartao scroll-mt-28 overflow-hidden rounded-2xl border border-[var(--wb-linha)] bg-white shadow-[0_6px_18px_-16px_rgba(53,5,69,0.5)]"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4 sm:p-5">
                    <span className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COR[s]}`}>
                      <span className={`size-2 rounded-full ${PONTO[s]}`} aria-hidden />
                      {ROTULO[s]}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--wb-tinta)] [text-wrap:balance]">{b.titulo}</p>
                      {b.href && (
                        <a href={b.href} target="_blank" rel="noopener noreferrer" className="text-sm text-red-700 underline underline-offset-4 hover:text-red-900">
                          Abrir a página ↗
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {b.href && !souAgencia && (s === "com-cliente") && (
                        <button
                          type="button"
                          onClick={() => registrar(b.id, null, "aprovado")}
                          disabled={ocupado === `${b.id}/pagina/aprovado`}
                          className="min-h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(5,150,105,0.9)] transition-[background-color,transform] hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
                        >
                          {ocupado === `${b.id}/pagina/aprovado` ? "Registrando…" : b.itens.length === 1 ? "Está tudo certo, aprovar" : "Está tudo certo, aprovar página"}
                        </button>
                      )}
                      {b.href && souAgencia && s === "aprovado" && (
                        <button
                          type="button"
                          onClick={() => registrar(b.id, null, "confirmado")}
                          disabled={ocupado === `${b.id}/pagina/confirmado`}
                          className="min-h-10 rounded-lg bg-[var(--wb-roxo)] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(53,5,69,0.9)] transition-[background-color,transform] hover:bg-[var(--wb-roxo-vivo)] active:scale-[0.98] disabled:opacity-60"
                        >
                          Agradecer e fechar a página
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => { setEscrevendo(escrevendo === chavePagina ? null : chavePagina); setAberta(b.id); setRascunho(""); }}
                        className="min-h-10 rounded-lg px-3.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 transition-colors hover:bg-slate-50"
                      >
                        {souAgencia ? "Pedir alguma coisa" : "Pedir alteração"}
                      </button>
                      {b.itens.length > 1 && b.id !== PAGINA_PENDENCIAS && (
                        <button
                          type="button"
                          onClick={() => setAberta(abertoAgora ? null : b.id)}
                          aria-expanded={abertoAgora}
                          aria-controls={`secoes-${b.id}`}
                          className="group inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        >
                          {b.itens.length} seções
                          <svg
                            viewBox="0 0 12 12"
                            aria-hidden
                            className={`size-3.5 transition-transform duration-300 ${abertoAgora ? "rotate-180" : ""}`}
                          >
                            <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {escrevendo === chavePagina && (
                    <Campo
                      valor={rascunho}
                      onChange={setRascunho}
                      onCancelar={() => setEscrevendo(null)}
                      onEnviar={() => registrar(b.id, null, "alteracao", rascunho)}
                      ocupado={ocupado === `${b.id}/pagina/alteracao`}
                      dica={`O que precisa em "${b.titulo}"? Texto, foto, ordem — o que for.`}
                    />
                  )}

                  <div className="wb-sanfona" data-aberta={abertoAgora}>
                    <div>
                    <ul id={`secoes-${b.id}`} className="divide-y divide-[var(--wb-linha)] border-t border-[var(--wb-linha)] bg-[var(--wb-fundo)]">
                      {[...b.itens, { id: ITEM_PAGINA, titulo: "Sobre a página inteira" }]
                        .filter((i) => i.id !== ITEM_PAGINA || historico(b.id, ITEM_PAGINA).length > 0)
                        .map((item) => (
                          <Linha
                            key={item.id}
                            blocoId={b.id}
                            pendencia={!b.href}
                            item={item}
                            situacao={sit(b.id, item.id)}
                            eventos={historico(b.id, item.id)}
                            souAgencia={souAgencia}
                            ocupado={ocupado}
                            escrevendo={escrevendo}
                            setEscrevendo={setEscrevendo}
                            rascunho={rascunho}
                            setRascunho={setRascunho}
                            registrar={registrar}
                          />
                        ))}
                    </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {visiveis.length === 0 && (
        <p className="mt-10 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Nada nesta lista.
        </p>
      )}
    </div>
  );
}

function Linha({
  blocoId, item, pendencia, situacao, eventos, souAgencia, ocupado,
  escrevendo, setEscrevendo, rascunho, setRascunho, registrar,
}: {
  blocoId: string;
  item: Item;
  /** Pendência avulsa: não é conteúdo do site, então quem resolve não é sempre o cliente. */
  pendencia?: boolean;
  situacao: Situacao;
  eventos: Evento[];
  souAgencia: boolean;
  ocupado: string | null;
  escrevendo: string | null;
  setEscrevendo: (v: string | null) => void;
  rascunho: string;
  setRascunho: (v: string) => void;
  registrar: (p: string, s: string | null, a: string, t?: string) => void;
}) {
  const chave = `${blocoId}/${item.id}`;
  const daPagina = item.id === ITEM_PAGINA;
  const temConversa = eventos.length > 0;
  const btn = "min-h-9 rounded-lg px-3 text-xs font-semibold transition-colors disabled:opacity-60";

  /**
   * Conteúdo do site e pendência avulsa têm donos diferentes.
   *
   * No site, a aprovação é sempre do cliente — mesmo quando foi a agência que pediu a foto e a
   * trocou, é ele quem diz se ficou boa. Numa pendência ("me adicionar no registro.br") quem
   * resolve é quem está com a bola, e quem confirma é quem pediu. Por isso o botão muda de nome
   * e de dono conforme o tipo de item.
   */
  const minhaVez =
    (souAgencia && situacao === "com-agencia") || (!souAgencia && situacao === "com-cliente");
  const ultimoAutor = eventos.length ? eventos[eventos.length - 1].autor : null;
  const podeConfirmar = situacao === "aprovado" && (pendencia ? ultimoAutor !== null && LADO[ultimoAutor] !== (souAgencia ? "agencia" : "cliente") : souAgencia);

  return (
    <li className="px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span key={situacao} className={`wb-ponto size-2.5 shrink-0 rounded-full ${PONTO[situacao]}`} aria-label={ROTULO[situacao]} />
        <p className="min-w-0 flex-1 text-sm text-slate-800">{item.titulo}</p>
        <div className="flex flex-wrap gap-1.5">
          {/* A aprovação do conteúdo é sempre do cliente, mesmo quando quem pediu foi a agência. */}
          {!daPagina && (pendencia ? minhaVez : !souAgencia && situacao === "com-cliente") && (
            <button type="button" onClick={() => registrar(blocoId, item.id, "aprovado")}
              disabled={ocupado === `${chave}/aprovado`}
              className={`${btn} bg-white text-emerald-800 ring-1 ring-emerald-300 hover:bg-emerald-50`}>
              {pendencia ? "Marcar como resolvido" : "Aprovar"}
            </button>
          )}
          {situacao === "aprovado" && ultimoAutor && LADO[ultimoAutor] === (souAgencia ? "agencia" : "cliente") && (
            <button type="button" onClick={() => registrar(blocoId, item.id, "desfeito")}
              disabled={ocupado === `${chave}/desfeito`}
              className={`${btn} text-slate-600 ring-1 ring-slate-300 hover:bg-white`}>
              Desfazer
            </button>
          )}
          {podeConfirmar && (
            <button type="button" onClick={() => registrar(blocoId, item.id, "confirmado")}
              disabled={ocupado === `${chave}/confirmado`}
              className={`${btn} bg-[var(--wb-roxo)] text-white hover:bg-[var(--wb-roxo-vivo)] active:scale-95`}>
              {pendencia ? "Confirmar e fechar" : "Agradecer"}
            </button>
          )}
          {!pendencia && souAgencia && situacao === "com-agencia" && (
            <button type="button" onClick={() => registrar(blocoId, item.id, "ajustado", "Feito, pode conferir.")}
              disabled={ocupado === `${chave}/ajustado`}
              className={`${btn} bg-amber-500 text-white hover:bg-amber-600`}>
              Marcar como feito
            </button>
          )}
          <button type="button"
            onClick={() => { setEscrevendo(escrevendo === chave ? null : chave); setRascunho(""); }}
            className={`${btn} text-slate-600 ring-1 ring-slate-300 hover:bg-white`}>
            {temConversa ? "Responder" : souAgencia ? "Pedir" : "Escrever"}
          </button>
        </div>
      </div>

      {temConversa && (
        <ol className="mt-2 space-y-1.5 border-l-2 border-slate-200 pl-3">
          {eventos.map((m) => (
            <li key={m.id} className="text-sm">
              <span className="font-medium text-slate-700">{m.autor}</span>{" "}
              <span className="text-slate-500">{VERBO[m.acao] ?? m.acao}</span>
              <span className="text-slate-400"> · {quando(m.em)}</span>
              {m.origem && (
                <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {m.origem === "whatsapp" ? "via WhatsApp" : "registro interno"}
                </span>
              )}
              {m.texto && <p className="whitespace-pre-line text-slate-700">{m.texto}</p>}
            </li>
          ))}
        </ol>
      )}

      {escrevendo === chave && (
        <Campo
          valor={rascunho}
          onChange={setRascunho}
          onCancelar={() => setEscrevendo(null)}
          onEnviar={() => registrar(blocoId, item.id, temConversa ? "resposta" : "alteracao", rascunho)}
          ocupado={ocupado === `${chave}/resposta` || ocupado === `${chave}/alteracao`}
          dica={temConversa ? "Sua resposta" : `O que precisa em "${item.titulo}"?`}
          compacto
        />
      )}
    </li>
  );
}

function Campo({
  valor, onChange, onEnviar, onCancelar, ocupado, dica, compacto,
}: {
  valor: string;
  onChange: (v: string) => void;
  onEnviar: () => void;
  onCancelar: () => void;
  ocupado: boolean;
  dica: string;
  compacto?: boolean;
}) {
  return (
    <div className={compacto ? "mt-2" : "border-t border-slate-100 bg-slate-50 px-4 py-4 sm:px-5"}>
      <label className="block text-sm font-medium text-slate-700">{dica}</label>
      <textarea
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        autoFocus
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
        placeholder="Escreva com suas palavras. Ex.: trocar a foto, o texto está desatualizado, a foto certa está no Drive…"
      />
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={onEnviar} disabled={ocupado || !valor.trim()}
          className="min-h-10 rounded-lg bg-[var(--wb-roxo)] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(53,5,69,0.9)] transition-[background-color,transform] hover:bg-[var(--wb-roxo-vivo)] active:scale-[0.98] disabled:opacity-50">
          {ocupado ? "Enviando…" : "Enviar"}
        </button>
        <button type="button" onClick={onCancelar} className="min-h-10 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
          Cancelar
        </button>
      </div>
    </div>
  );
}
