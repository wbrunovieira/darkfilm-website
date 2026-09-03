"use client";

import { useCallback, useMemo, useState } from "react";
import { paginasRevisao, type PaginaRevisao } from "@/content/revisao";
import {
  AUTORES,
  AUTOR_AGENCIA,
  ITEM_PAGINA,
  type Autor,
  type Evento,
  type Situacao,
} from "@/lib/revisao";

const ROTULO: Record<Situacao, string> = {
  pendente: "Aguardando revisão",
  aprovado: "Aprovado",
  confirmado: "Aprovado e confirmado",
  alteracao: "Alteração pedida",
  ajustado: "Ajustado, confira",
};

/** amarelo = com o cliente · vermelho = com a agência · verde = fechado */
const COR: Record<Situacao, string> = {
  pendente: "bg-amber-100 text-amber-900 ring-amber-300",
  aprovado: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  confirmado: "bg-emerald-600 text-white ring-emerald-600",
  alteracao: "bg-red-100 text-red-900 ring-red-300",
  ajustado: "bg-amber-100 text-amber-900 ring-amber-300",
};
const PONTO: Record<Situacao, string> = {
  pendente: "bg-amber-400",
  aprovado: "bg-emerald-400",
  confirmado: "bg-emerald-600",
  alteracao: "bg-red-500",
  ajustado: "bg-amber-400",
};

type Filtro = "tudo" | "pendente" | "alteracao" | "aguardando" | "confirmado";

function quando(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

const VERBO: Record<string, string> = {
  aprovado: "aprovou",
  desfeito: "desfez a aprovação",
  confirmado: "confirmou e agradeceu",
  alteracao: "pediu alteração",
  ajustado: "marcou como ajustado",
};

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

  const sit = useCallback(
    (paginaId: string, secaoId: string): Situacao =>
      situacoes[`${paginaId}/${secaoId}`] ?? "pendente",
    [situacoes],
  );

  /**
   * Situação da página: o pior estado manda. Uma alteração pedida em qualquer item deixa a
   * página vermelha, ainda que todo o resto esteja aprovado — é o que o Bruno precisa enxergar
   * na lista. Verde cheio só quando cada item foi aprovado E confirmado.
   */
  const sitPagina = useCallback(
    (p: PaginaRevisao): Situacao => {
      const itens = [...p.secoes.map((s) => sit(p.id, s.id)), sit(p.id, ITEM_PAGINA)];
      if (itens.includes("alteracao")) return "alteracao";
      if (itens.includes("ajustado")) return "ajustado";
      const secoes = p.secoes.map((s) => sit(p.id, s.id));
      if (secoes.every((x) => x === "confirmado")) return "confirmado";
      if (secoes.every((x) => x === "aprovado" || x === "confirmado")) return "aprovado";
      return "pendente";
    },
    [sit],
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
            if (ev.secaoId) m[`${ev.paginaId}/${ev.secaoId}`] = ev.acao as Situacao;
          }
          return m;
        });
        setEscrevendo(null);
        setRascunho("");
      } catch (e) {
        setErro(e instanceof Error ? e.message : "não foi possível registrar");
      } finally {
        setOcupado(null);
      }
    },
    [autor],
  );

  const total = useMemo(
    () => paginasRevisao.reduce((n, p) => n + p.secoes.length, 0),
    [],
  );
  const aprovados = useMemo(
    () =>
      paginasRevisao.reduce(
        (n, p) =>
          n +
          p.secoes.filter((s) => {
            const x = sit(p.id, s.id);
            return x === "aprovado" || x === "confirmado";
          }).length,
        0,
      ),
    [sit],
  );
  const aguardandoConfirmacao = useMemo(
    () => paginasRevisao.filter((p) => sitPagina(p) === "aprovado").length,
    [sitPagina],
  );
  const pendentesDoBruno = useMemo(
    () => paginasRevisao.filter((p) => sitPagina(p) === "alteracao").length,
    [sitPagina],
  );

  const visiveis = useMemo(
    () =>
      paginasRevisao.filter((p) => {
        if (filtro === "tudo") return true;
        const s = sitPagina(p);
        if (filtro === "pendente") return s === "pendente" || s === "ajustado";
        return s === filtro;
      }),
    [filtro, sitPagina],
  );

  const grupos = useMemo(() => {
    const m = new Map<string, PaginaRevisao[]>();
    for (const p of visiveis) m.set(p.grupo, [...(m.get(p.grupo) ?? []), p]);
    return [...m.entries()];
  }, [visiveis]);

  /** Tudo o que aconteceu com o item, inclusive aprovar e desfazer — é o que se perde no zap. */
  const historico = useCallback(
    (paginaId: string, secaoId: string) =>
      eventos.filter((e) => e.paginaId === paginaId && e.secaoId === secaoId),
    [eventos],
  );

  const pct = total ? Math.round((aprovados / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      {/* ---------- Cabeçalho ---------- */}
      <header className="pt-10 sm:pt-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          The Dark Film &amp; Sound
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Revisão do site novo
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Abra cada página, confira e aprove. Se algo precisar mudar, escreva ali mesmo — não
          precisa lembrar depois nem procurar no WhatsApp. O que você já aprovou fica verde e sai
          da sua lista.
        </p>
      </header>

      {/* ---------- Progresso ---------- */}
      <section aria-label="Progresso" className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-lg font-semibold text-slate-900">
            {aprovados} de {total} itens aprovados
          </p>
          <p className="text-sm text-slate-500">
            {pendentesDoBruno > 0
              ? `${pendentesDoBruno} ${pendentesDoBruno === 1 ? "página está" : "páginas estão"} com alteração pedida`
              : "Nenhuma alteração pendente"}
            {aguardandoConfirmacao > 0 && ` · ${aguardandoConfirmacao} aguardando confirmação`}
          </p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </section>

      {/* ---------- Quem está escrevendo ---------- */}
      <section className="sticky top-0 z-20 -mx-4 mt-6 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-700">Quem está revisando:</span>
            <select
              value={autor}
              onChange={(e) => setAutor(e.target.value as Autor)}
              className="min-h-9 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              {AUTORES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

          <div role="group" aria-label="Filtrar páginas" className="flex flex-wrap gap-1.5">
            {(
              [
                ["tudo", `Tudo (${paginasRevisao.length})`],
                ["pendente", "Faltam revisar"],
                ["alteracao", "Alterações pedidas"],
                ["aguardando", `Aguardando confirmação${aguardandoConfirmacao ? ` (${aguardandoConfirmacao})` : ""}`],
                ["confirmado", "Fechadas"],
              ] as [Filtro, string][]
            ).map(([id, rot]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFiltro(id)}
                aria-pressed={filtro === id}
                className={`min-h-9 rounded-full px-3.5 text-sm font-medium transition-colors ${
                  filtro === id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-300 hover:text-slate-900"
                }`}
              >
                {rot}
              </button>
            ))}
          </div>
        </div>
      </section>

      {erro && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
          {erro}
        </p>
      )}

      {/* ---------- Páginas ---------- */}
      {grupos.map(([grupo, itens]) => (
        <section key={grupo} className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            {grupo} <span className="font-normal text-slate-400">({itens.length})</span>
          </h2>

          <ul className="mt-3 space-y-3">
            {itens.map((p) => {
              const s = sitPagina(p);
              const abertaAgora = aberta === p.id;
              const soUmaSecao = p.secoes.length === 1;
              const chavePagina = `${p.id}/pagina`;
              return (
                <li key={p.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4 sm:p-5">
                    <span className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COR[s]}`}>
                      <span className={`size-2 rounded-full ${PONTO[s]}`} aria-hidden />
                      {ROTULO[s]}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">{p.titulo}</p>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-red-700 underline underline-offset-4 hover:text-red-900"
                      >
                        Abrir a página ↗
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {(s === "pendente" || s === "ajustado") && (
                        <button
                          type="button"
                          onClick={() => registrar(p.id, null, "aprovado")}
                          disabled={ocupado === `${p.id}/pagina/aprovado`}
                          className="min-h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {ocupado === `${p.id}/pagina/aprovado`
                            ? "Registrando…"
                            : soUmaSecao
                              ? "Está tudo certo, aprovar"
                              : "Está tudo certo, aprovar página"}
                        </button>
                      )}

                      {/* Enquanto ninguém agradeceu, a aprovação é de um lado só: desfazer sem
                          atrito, porque na revisão se clica errado e se muda de ideia. */}
                      {s === "aprovado" && (
                        <button
                          type="button"
                          onClick={() => registrar(p.id, null, "desfeito")}
                          disabled={ocupado === `${p.id}/pagina/desfeito`}
                          className="min-h-10 rounded-lg px-3.5 text-sm font-medium text-slate-600 ring-1 ring-slate-300 transition-colors hover:bg-slate-50 disabled:opacity-60"
                        >
                          Desfazer aprovação
                        </button>
                      )}

                      {/* O agradecimento é o que transforma uma afirmação de um lado em acordo.
                          Só aparece para a agência — trava contra clique errado, não segurança. */}
                      {s === "aprovado" && autor === AUTOR_AGENCIA && (
                        <button
                          type="button"
                          onClick={() => registrar(p.id, null, "confirmado")}
                          disabled={ocupado === `${p.id}/pagina/confirmado`}
                          className="min-h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-60"
                        >
                          Agradecer e fechar
                        </button>
                      )}

                      {s === "alteracao" && autor === AUTOR_AGENCIA && (
                        <button
                          type="button"
                          onClick={() => registrar(p.id, null, "ajustado", "Ajuste feito, pode conferir.")}
                          disabled={ocupado === `${p.id}/pagina/ajustado`}
                          className="min-h-10 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 disabled:opacity-60"
                        >
                          Marcar como ajustado
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setEscrevendo(escrevendo === chavePagina ? null : chavePagina);
                          setAberta(p.id);
                          setRascunho("");
                        }}
                        className="min-h-10 rounded-lg px-3.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 transition-colors hover:bg-slate-50"
                      >
                        Pedir alteração
                      </button>
                      {!soUmaSecao && (
                        <button
                          type="button"
                          onClick={() => setAberta(abertaAgora ? null : p.id)}
                          aria-expanded={abertaAgora}
                          className="min-h-10 rounded-lg px-3 text-sm text-slate-500 transition-colors hover:text-slate-900"
                        >
                          {abertaAgora ? "Fechar seções" : `Ver as ${p.secoes.length} seções`}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* pedido de alteração da página inteira */}
                  {escrevendo === chavePagina && (
                    <CampoAlteracao
                      valor={rascunho}
                      onChange={setRascunho}
                      onCancelar={() => setEscrevendo(null)}
                      onEnviar={() => registrar(p.id, null, "alteracao", rascunho)}
                      ocupado={ocupado === `${p.id}/pagina/alteracao`}
                      dica={`O que precisa mudar em "${p.titulo}"? Texto, foto, ordem — o que for.`}
                    />
                  )}

                  {(abertaAgora || soUmaSecao) && (
                    <ul className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/60">
                      {[...p.secoes.map((sec) => sec), { id: ITEM_PAGINA, titulo: "Observações sobre a página inteira" }]
                        .filter((sec) => sec.id !== ITEM_PAGINA || historico(p.id, ITEM_PAGINA).length > 0)
                        .map((sec) => {
                          const ss = sit(p.id, sec.id);
                          const chave = `${p.id}/${sec.id}`;
                          const msgs = historico(p.id, sec.id);
                          return (
                            <li key={sec.id} className="px-4 py-3 sm:px-5">
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                <span className={`size-2.5 shrink-0 rounded-full ${PONTO[ss]}`} aria-label={ROTULO[ss]} />
                                <p className="min-w-0 flex-1 text-sm text-slate-800">{sec.titulo}</p>
                                <div className="flex gap-1.5">
                                  {(ss === "pendente" || ss === "ajustado") && sec.id !== ITEM_PAGINA && (
                                    <button
                                      type="button"
                                      onClick={() => registrar(p.id, sec.id, "aprovado")}
                                      disabled={ocupado === `${chave}/aprovado`}
                                      className="min-h-9 rounded-lg bg-white px-3 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-300 transition-colors hover:bg-emerald-50 disabled:opacity-60"
                                    >
                                      Aprovar
                                    </button>
                                  )}
                                  {ss === "aprovado" && (
                                    <button
                                      type="button"
                                      onClick={() => registrar(p.id, sec.id, "desfeito")}
                                      disabled={ocupado === `${chave}/desfeito`}
                                      className="min-h-9 rounded-lg px-2.5 text-xs font-medium text-slate-600 ring-1 ring-slate-300 transition-colors hover:bg-white disabled:opacity-60"
                                    >
                                      Desfazer
                                    </button>
                                  )}
                                  {ss === "aprovado" && autor === AUTOR_AGENCIA && (
                                    <button
                                      type="button"
                                      onClick={() => registrar(p.id, sec.id, "confirmado")}
                                      disabled={ocupado === `${chave}/confirmado`}
                                      className="min-h-9 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
                                    >
                                      Agradecer
                                    </button>
                                  )}
                                  {ss === "alteracao" && autor === AUTOR_AGENCIA && (
                                    <button
                                      type="button"
                                      onClick={() => registrar(p.id, sec.id, "ajustado", "Ajuste feito, pode conferir.")}
                                      disabled={ocupado === `${chave}/ajustado`}
                                      className="min-h-9 rounded-lg bg-white px-3 text-xs font-semibold text-amber-800 ring-1 ring-amber-300 transition-colors hover:bg-amber-50 disabled:opacity-60"
                                    >
                                      Marcar como ajustado
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEscrevendo(escrevendo === chave ? null : chave);
                                      setRascunho("");
                                    }}
                                    className="min-h-9 rounded-lg px-2.5 text-xs font-medium text-slate-600 ring-1 ring-slate-300 transition-colors hover:bg-white"
                                  >
                                    Escrever
                                  </button>
                                </div>
                              </div>

                              {msgs.length > 0 && (
                                <ol className="mt-2 space-y-1.5 border-l-2 border-slate-200 pl-3">
                                  {msgs.map((m) => (
                                    <li key={m.id} className="text-sm">
                                      <span className="font-medium text-slate-700">{m.autor}</span>{" "}
                                      <span className="text-slate-500">{VERBO[m.acao] ?? m.acao}</span>
                                      <span className="text-slate-400"> · {quando(m.em)}</span>
                                      {m.texto && <p className="text-slate-700">{m.texto}</p>}
                                    </li>
                                  ))}
                                </ol>
                              )}

                              {escrevendo === chave && (
                                <CampoAlteracao
                                  valor={rascunho}
                                  onChange={setRascunho}
                                  onCancelar={() => setEscrevendo(null)}
                                  onEnviar={() => registrar(p.id, sec.id, "alteracao", rascunho)}
                                  ocupado={ocupado === `${chave}/alteracao`}
                                  dica={`O que muda em "${sec.titulo}"?`}
                                  compacto
                                />
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  )}
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

function CampoAlteracao({
  valor,
  onChange,
  onEnviar,
  onCancelar,
  ocupado,
  dica,
  compacto,
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
        placeholder="Escreva com suas palavras. Ex.: trocar a foto, o texto está desatualizado, falta o telefone…"
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={onEnviar}
          disabled={ocupado || !valor.trim()}
          className="min-h-10 rounded-lg bg-red-700 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-800 disabled:opacity-50"
        >
          {ocupado ? "Enviando…" : "Enviar pedido"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="min-h-10 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
