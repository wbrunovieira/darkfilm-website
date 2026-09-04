"use client";

/**
 * Painel de revisão — a tela que substitui a conversa de WhatsApp entre a oficina e a WB.
 *
 * Três decisões estruturam tudo o que está aqui, e vale a pena registrá-las porque nenhuma
 * delas é óbvia lendo o código solto:
 *
 * 1. **Uma ação principal por cartão.** A crítica do cliente ("os botões estão de júnior") não
 *    era sobre a aparência dos retângulos, era sobre não haver hierarquia: aprovar, pedir
 *    alteração e abrir a página tinham o mesmo peso lado a lado. Agora cada cartão calcula qual
 *    é *a* coisa a fazer agora (`acaoPrincipal`) e só ela é preenchida; o resto é contorno.
 *
 * 2. **A cor é relativa a quem está lendo** (ver `tom` em `ui.tsx`). Numa lista de 55 páginas,
 *    a única coisa que pode ter cor forte é o que espera pela pessoa que está com a tela aberta.
 *
 * 3. **A pergunta em aberto vem para a frente do cartão.** Era o defeito mais caro: a WB
 *    respondia, a resposta ficava a dois toques de distância dentro da sanfona, e o cliente
 *    voltava a perguntar no WhatsApp. Agora a última fala pendente é o corpo do cartão.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { paginasRevisao, type SecaoRevisao } from "@/content/revisao";

import {
  AUTORES,
  ITEM_PAGINA,
  LADO,
  PAGINA_PENDENCIAS,
  pendenciasGerais,
  type Autor,
  type Evento,
  type Situacao,
} from "@/lib/revisao";
import { Conversa, Campo } from "./Conversa";
import {
  Aviso,
  Botao,
  LinkSaida,
  NOME_AGENCIA,
  NOME_CLIENTE,
  PONTO,
  Selo,
  TRILHO,
  apelido,
  haQuanto,
  rotulo,
  tom,
  type Tom,
} from "./ui";

type Item = SecaoRevisao;
type Bloco = { id: string; titulo: string; href?: string; grupo: string; itens: Item[] };

/** Filtros pela ótica de quem lê, não pelos nomes internos dos estados. */
type Filtro = "tudo" | "voce" | "eles" | "novo" | "pronto";

const GRUPO_ASSUNTOS = "Outros assuntos";

/* ------------------------------------------------------------------ contexto */

/**
 * O que todo cartão precisa. Vira contexto porque a alternativa era passar onze propriedades
 * por quatro níveis de componente — foi assim que a versão anterior virou um arquivo só.
 */
type Acoes = {
  autor: Autor;
  souAgencia: boolean;
  ocupado: string | null;
  /** Erro da última tentativa, endereçado ao item onde o clique aconteceu. */
  erroDe: (alvo: string) => string | null;
  flash: string | null;
  escrevendo: string | null;
  abrirEscrita: (chave: string | null) => void;
  rascunho: string;
  setRascunho: (v: string) => void;
  registrar: (paginaId: string, secaoId: string | null, acao: string, texto?: string) => void;
  sit: (paginaId: string, itemId: string) => Situacao;
  eventosDe: (paginaId: string, itemId?: string) => Evento[];
};

const Ctx = createContext<Acoes | null>(null);
function useAcoes() {
  const c = useContext(Ctx);
  if (!c) throw new Error("fora do painel");
  return c;
}

/* ------------------------------------------------------------------ painel */

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
  const [erro, setErro] = useState<{ alvo: string; msg: string } | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [escrevendo, setEscrevendo] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState("");
  const [novoAssunto, setNovoAssunto] = useState(false);

  const souAgencia = LADO[autor] === "agencia";

  const sit = useCallback(
    (paginaId: string, itemId: string): Situacao => situacoes[`${paginaId}/${itemId}`] ?? "novo",
    [situacoes],
  );

  /** Índice por página: com 45 eventos e 56 blocos, filtrar o array inteiro por cartão custa. */
  const porPagina = useMemo(() => {
    const m = new Map<string, Evento[]>();
    for (const e of eventos) m.set(e.paginaId, [...(m.get(e.paginaId) ?? []), e]);
    return m;
  }, [eventos]);

  const eventosDe = useCallback(
    (paginaId: string, itemId?: string) => {
      const todos = porPagina.get(paginaId) ?? [];
      return itemId ? todos.filter((e) => e.secaoId === itemId) : todos;
    },
    [porPagina],
  );

  const registrar = useCallback(
    async (paginaId: string, secaoId: string | null, acao: string, texto?: string) => {
      const alvo = `${paginaId}/${secaoId ?? "pagina"}`;
      setOcupado(`${alvo}/${acao}`);
      setErro(null);
      try {
        const r = await fetch("/api/revisao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paginaId, secaoId, acao, autor, texto }),
          // Ele usa isto na loja, com sinal instável. Sem prazo, uma requisição pendurada deixa
          // o botão em "Enviando…" para sempre e não há como saber se gravou ou não.
          signal: AbortSignal.timeout(20000),
        });
        const dados = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(dados?.erro ?? "falhou");
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
        setNovoAssunto(false);
        // Piscada curta no cartão: a lista é longa e o clique precisa de recibo visual.
        setFlash(alvo);
        setTimeout(() => setFlash((f) => (f === alvo ? null : f)), 700);
      } catch (e) {
        const rede =
          e instanceof DOMException || (e instanceof TypeError && e.message.includes("fetch"));
        setErro({
          alvo,
          // Em português de recado, não de API. "failed to fetch" não diz nada a ele.
          msg: rede
            ? "Não deu para salvar — a internet parece ter caído. Confira o sinal e toque de novo."
            : "Não deu para salvar agora. Toque de novo; se continuar, me chame no WhatsApp que eu registro por aqui.",
        });
      } finally {
        setOcupado(null);
      }
    },
    [autor],
  );

  const erroDe = useCallback((alvo: string) => (erro?.alvo === alvo ? erro.msg : null), [erro]);

  const abrirEscrita = useCallback((chave: string | null) => {
    setEscrevendo(chave);
    setRascunho("");
    setErro(null);
  }, []);

  /** Blocos = páginas do site + os assuntos avulsos abertos aqui dentro. */
  const blocos: Bloco[] = useMemo(() => {
    const avulsos = pendenciasGerais(eventos);
    const dasPaginas = paginasRevisao.map((p) => ({
      id: p.id,
      titulo: p.titulo,
      href: p.href,
      grupo: p.grupo,
      itens: p.secoes,
    }));
    return avulsos.length
      ? [
          ...dasPaginas,
          {
            id: PAGINA_PENDENCIAS,
            titulo: GRUPO_ASSUNTOS,
            grupo: GRUPO_ASSUNTOS,
            itens: avulsos.map((x) => ({ id: x.id, titulo: x.titulo })),
          },
        ]
      : dasPaginas;
  }, [eventos]);

  /** O pior estado manda: uma bola pendente deixa a página pendente na lista. */
  const sitBloco = useCallback(
    (b: Bloco): Situacao => {
      // Inclui o item da página inteira: um pedido feito ali também deixa a página pendente.
      const itens = [...b.itens.map((i) => sit(b.id, i.id)), sit(b.id, ITEM_PAGINA)];
      // Conversa aberta vem antes de tudo: é a única coisa que exige ação de alguém agora.
      if (itens.includes("com-cliente")) return "com-cliente";
      if (itens.includes("com-agencia")) return "com-agencia";
      const secoes = b.itens.map((i) => sit(b.id, i.id));
      if (secoes.every((x) => x === "fechado")) return "fechado";
      if (secoes.every((x) => x === "aprovado" || x === "fechado")) return "aprovado";
      return "novo";
    },
    [sit],
  );

  /**
   * A última fala que ainda espera resposta, por bloco.
   *
   * É o que sobe para a frente do cartão. Sem isso a pergunta da WB ficava atrás de dois
   * toques, e o cliente respondia no WhatsApp — que é exatamente o que esta tela existe para
   * acabar.
   */
  const emAberto = useMemo(() => {
    const m = new Map<string, { ev: Evento; parte: string }>();
    for (const b of blocos) {
      const titulos = new Map(b.itens.map((i) => [i.id, i.titulo]));
      let ultimo: Evento | null = null;
      for (const e of porPagina.get(b.id) ?? []) {
        if (!e.secaoId || !e.texto) continue;
        const s = sit(b.id, e.secaoId);
        if (s !== "com-cliente" && s !== "com-agencia") continue;
        // `eventos` já vem ordenado por data; o último que passar no filtro é o mais recente.
        ultimo = e;
      }
      if (ultimo) {
        m.set(b.id, {
          ev: ultimo,
          parte: ultimo.secaoId === ITEM_PAGINA ? "" : (titulos.get(ultimo.secaoId!) ?? ""),
        });
      }
    }
    return m;
  }, [blocos, porPagina, sit]);

  const paginas = useMemo(() => blocos.filter((b) => !!b.href), [blocos]);
  const total = paginas.length;
  const prontas = useMemo(
    () => paginas.filter((b) => ["aprovado", "fechado"].includes(sitBloco(b))).length,
    [paginas, sitBloco],
  );

  /** Contagem por tom — é o que rotula os filtros e a chamada do topo. */
  const contagem = useMemo(() => {
    const c: Record<Tom, number> = { silencio: 0, voce: 0, eles: 0, aprovado: 0, pronto: 0 };
    for (const b of blocos) c[tom(sitBloco(b), souAgencia)]++;
    return c;
  }, [blocos, sitBloco, souAgencia]);

  /**
   * As duas filas, nomeadas.
   *
   * Antes era uma caixa só, "N itens esperam por você" — e "você" depende de quem abriu a tela.
   * O painel é dos dois lados: quem lê pode ser a The Dark Film ou a WB, e a mesma frase queria
   * dizer coisas diferentes. Agora cada fila leva o nome de quem a segura, e ninguém precisa
   * lembrar em nome de quem entrou.
   */
  // "novo" fica fora das filas de propósito: é o silêncio do padrão, não uma dívida de ninguém.
  const comCliente = useMemo(
    () => blocos.filter((b) => sitBloco(b) === "com-cliente"),
    [blocos, sitBloco],
  );
  // "aprovado" entra na fila da WB: o cliente já falou, falta a gente confirmar e fechar.
  const comAgencia = useMemo(
    () => blocos.filter((b) => ["com-agencia", "aprovado"].includes(sitBloco(b))),
    [blocos, sitBloco],
  );
  const praVoce = souAgencia ? comAgencia : comCliente;

  const combina = useCallback(
    (b: Bloco) => {
      const t = tom(sitBloco(b), souAgencia);
      if (filtro === "tudo") return true;
      if (filtro === "pronto") return t === "aprovado" || t === "pronto";
      if (filtro === "novo") return t === "silencio";
      return t === filtro;
    },
    [filtro, sitBloco, souAgencia],
  );

  const grupos = useMemo(() => {
    const m = new Map<string, Bloco[]>();
    for (const b of blocos) if (combina(b)) m.set(b.grupo, [...(m.get(b.grupo) ?? []), b]);
    // Ordem de leitura: as páginas do site primeiro, os assuntos avulsos depois, e só então os
    // 45 produtos — que são volume, não prioridade.
    const peso = (g: string) => (g === "Páginas do site" ? 0 : g === GRUPO_ASSUNTOS ? 1 : 2);
    return [...m.entries()].sort((a, b) => peso(a[0]) - peso(b[0]));
  }, [blocos, combina]);

  const pct = total ? Math.round((prontas / total) * 100) : 0;

  const irPara = useCallback((id: string) => {
    setAberta(id);
    requestAnimationFrame(() =>
      document.getElementById(`bloco-${id}`)?.scrollIntoView({ block: "start", behavior: "smooth" }),
    );
  }, []);

  const acoes: Acoes = {
    autor,
    souAgencia,
    ocupado,
    erroDe,
    flash,
    escrevendo,
    abrirEscrita,
    rascunho,
    setRascunho,
    registrar,
    sit,
    eventosDe,
  };

  return (
    <Ctx.Provider value={acoes}>
      <div className="mx-auto max-w-4xl px-4 pb-28 sm:px-6">
        <Abertura
          autor={autor}
          setAutor={setAutor}
          prontas={prontas}
          total={total}
          pct={pct}
        />

        <BarraFiltros
          filtro={filtro}
          setFiltro={setFiltro}
          contagem={contagem}
          totalBlocos={blocos.length}
          souAgencia={souAgencia}
        />

        {filtro === "tudo" && (comCliente.length > 0 || comAgencia.length > 0) && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Fila
              titulo={`Esperando ${NOME_CLIENTE}`}
              nota="Precisa de aprovação ou resposta de vocês."
              blocos={comCliente}
              lado="cliente"
              souAgencia={souAgencia}
              irPara={irPara}
            />
            <Fila
              titulo={`Esperando a ${NOME_AGENCIA}`}
              nota="Estamos resolvendo por aqui."
              blocos={comAgencia}
              lado="agencia"
              souAgencia={souAgencia}
              irPara={irPara}
            />
          </div>
        )}

        {grupos.map(([grupo, itens]) => (
          <section key={grupo} className="mt-9">
            <TituloDeGrupo grupo={grupo} quantos={itens.length} total={total} />

            {grupo === "Páginas do site" ? (
              <ul className="mt-3 flex flex-col gap-3">
                {itens.map((b, i) => (
                  <CartaoPagina
                    key={b.id}
                    b={b}
                    i={i}
                    situacao={sitBloco(b)}
                    aberto={aberta === b.id}
                    alternar={() => setAberta(aberta === b.id ? null : b.id)}
                    aberta={emAberto.get(b.id)}
                  />
                ))}
              </ul>
            ) : (
              <GrupoCompacto
                blocos={itens}
                sitBloco={sitBloco}
                emAberto={emAberto}
                aberta={aberta}
                setAberta={setAberta}
                assuntos={grupo === GRUPO_ASSUNTOS}
              />
            )}
          </section>
        ))}

        {grupos.length === 0 && (
          <p className="mt-10 rounded-2xl border border-[var(--wb-linha)] bg-white p-10 text-center text-[15px] text-[var(--wb-tinta-2)]">
            Nada nesta lista — experimente &ldquo;Tudo&rdquo;.
          </p>
        )}

        <NovoAssunto
          aberto={novoAssunto}
          abrir={setNovoAssunto}
          rascunho={rascunho}
          setRascunho={setRascunho}
          registrar={registrar}
          ocupado={ocupado}
          erro={erroDe(`${PAGINA_PENDENCIAS}/pagina`)}
          autor={autor}
        />
      </div>
    </Ctx.Provider>
  );
}

/* ------------------------------------------------------------------ abertura */

function Abertura({
  autor,
  setAutor,
  prontas,
  total,
  pct,
}: {
  autor: Autor;
  setAutor: (a: Autor) => void;
  prontas: number;
  total: number;
  pct: number;
}) {
  return (
    <header className="pt-8 sm:pt-12">
      <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--wb-roxo-vivo)]">
        The Dark Film &amp; Sound
      </p>
      <h1 className="mt-1.5 text-[30px] font-extrabold leading-[1.08] tracking-tight text-[var(--wb-roxo)] sm:text-[42px]">
        Revisão do site novo
      </h1>
      {/* Duas linhas no celular. A explicação longa do registro já está no rodapé. */}
      <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-[var(--wb-tinta-2)]">
        Abra cada página, veja como ficou e diga se está certo. O que precisar mudar, escreva
        aqui — fica guardado com data e nome.
      </p>

      <div className="wb-entra mt-6 overflow-hidden rounded-2xl border border-[var(--wb-linha)] bg-white shadow-[0_14px_40px_-30px_rgba(53,5,69,0.6)]">
        {/*
          O seletor de quem escreve saiu da barra fixa e veio para cá. Ele é escolhido uma vez
          por sessão e ocupava, grudado no topo, um terço da altura útil do celular.
        */}
        <label className="flex items-center gap-3 border-b border-[var(--wb-linha)] px-3.5 py-2.5">
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--wb-roxo)] text-[15px] font-bold text-white"
          >
            {autor[0]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-medium text-[var(--wb-tinta-3)]">
              Quem está revisando
            </span>
            <select
              value={autor}
              onChange={(e) => setAutor(e.target.value as Autor)}
              className="wb-foco -ml-1 w-full max-w-full rounded-lg bg-transparent px-1 text-[16px] font-bold text-[var(--wb-tinta)] focus:outline-none"
              // 44px de alvo mesmo sendo um select nativo: é o único controle da tela que
              // decide de quem é a assinatura do registro, errar nele adultera a auditoria.
              style={{ minHeight: 44 }}
            >
              {AUTORES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </span>
        </label>

        <div className="p-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] font-bold text-[var(--wb-tinta)]">
              {prontas} de {total} páginas prontas
            </p>
            <p className="text-[13px] font-semibold text-[var(--wb-tinta-3)]">{pct}%</p>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--wb-linha)]"
            role="progressbar"
            aria-valuenow={prontas}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label="Páginas prontas"
          >
            <div
              className="wb-progresso h-full rounded-full transition-[width] duration-700"
              style={{ width: `${Math.max(pct, 1.5)}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ filtros */

function BarraFiltros({
  filtro,
  setFiltro,
  contagem,
  totalBlocos,
  souAgencia,
}: {
  filtro: Filtro;
  setFiltro: (f: Filtro) => void;
  contagem: Record<Tom, number>;
  totalBlocos: number;
  souAgencia: boolean;
}) {
  // "Precisa de você" dizia coisas diferentes conforme quem estivesse selecionado no topo,
  // e ficava logo acima de duas colunas que já nomeiam os lados. Os chips passam a nomear
  // também, e na MESMA ordem das colunas — cliente primeiro, sempre. Sem isso os chips
  // trocavam de lugar ao alternar o autor enquanto as colunas ficavam paradas.
  const filtroCliente: Filtro = souAgencia ? "eles" : "voce";
  const filtroAgencia: Filtro = souAgencia ? "voce" : "eles";
  const nCliente = souAgencia ? contagem.eles : contagem.voce;
  const nAgencia = souAgencia ? contagem.voce : contagem.eles;
  const chips: [Filtro, string, number][] = [
    ["tudo", "Tudo", totalBlocos],
    [filtroCliente, `Esperando ${NOME_CLIENTE}`, nCliente],
    [filtroAgencia, "Esperando a WB", nAgencia],
    ["novo", "Falta olhar", contagem.silencio],
    ["pronto", "Prontas", contagem.aprovado + contagem.pronto],
  ];
  return (
    // A barra fixa comia 203px de 844px. Agora é uma faixa só, e rola na horizontal em vez de
    // quebrar em três linhas.
    <div className="sticky top-0 z-30 -mx-4 mt-6 border-y border-[var(--wb-linha)] bg-[var(--wb-fundo)]/95 backdrop-blur sm:-mx-6">
      <div
        role="group"
        aria-label="Filtrar a lista"
        className="flex gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {chips.map(([id, texto, n]) => {
          const ativo = filtro === id;
          const vazio = n === 0 && id !== "tudo";
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFiltro(id)}
              aria-pressed={ativo}
              disabled={vazio}
              className={`wb-foco inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-colors duration-150 disabled:opacity-40 ${
                ativo
                  ? "bg-[var(--wb-roxo)] text-white"
                  : id === "voce" && n > 0
                    ? "bg-[var(--wb-ambar-leve)] text-[var(--wb-ambar-tinta)] ring-1 ring-[var(--wb-ambar-borda)]"
                    : "bg-white text-[var(--wb-tinta-2)] ring-1 ring-[var(--wb-linha)] hover:ring-[var(--wb-lilas)]"
              }`}
            >
              {texto}
              <span className={ativo ? "text-white/70" : "text-[var(--wb-tinta-3)]"}>{n}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TituloDeGrupo({
  grupo,
  quantos,
  total,
}: {
  grupo: string;
  quantos: number;
  total: number;
}) {
  const sufixo =
    grupo === GRUPO_ASSUNTOS
      ? `${quantos} ${quantos === 1 ? "assunto" : "assuntos"}`
      : grupo === "Páginas do site"
        ? `${quantos} de ${total}`
        : `${quantos} ${quantos === 1 ? "página" : "páginas"}`;
  return (
    <h2 className="flex flex-wrap items-baseline gap-x-2 text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--wb-tinta-2)]">
      {grupo}
      <span className="font-medium normal-case tracking-normal text-[var(--wb-tinta-3)]">
        {sufixo}
      </span>
    </h2>
  );
}

/* ------------------------------------------------------------------ chamada */

/**
 * Uma das duas filas do topo, sempre nomeada.
 *
 * A fila de quem está lendo fica destacada; a do outro lado fica sóbria — não é dívida dele, é
 * informação de que a bola está do outro lado. Nenhuma das duas diz "você": o painel é dos dois,
 * e "você" só faz sentido para quem escreveu a frase.
 */
function Fila({
  titulo,
  nota,
  blocos,
  lado,
  souAgencia,
  irPara,
}: {
  titulo: string;
  nota: string;
  blocos: Bloco[];
  lado: "cliente" | "agencia";
  souAgencia: boolean;
  irPara: (id: string) => void;
}) {
  const n = blocos.length;
  const minha = souAgencia === (lado === "agencia");
  const vazia = n === 0;

  return (
    <section
      className={`wb-entra overflow-hidden rounded-2xl ring-1 ${
        vazia
          ? "bg-white/60 ring-[var(--wb-linha)]"
          : minha
            ? "bg-[var(--wb-ambar-leve)] ring-[var(--wb-ambar-borda)]"
            : "bg-white ring-[var(--wb-linha)]"
      }`}
    >
      <div className="px-4 pb-1 pt-3.5">
        <h2 className="flex items-baseline gap-2 text-[15px] font-extrabold text-[var(--wb-tinta)]">
          <span
            aria-hidden
            className={`size-2.5 shrink-0 rounded-full ${
              vazia ? "bg-[var(--wb-linha)]" : lado === "cliente" ? "bg-[var(--wb-ambar)]" : "bg-[var(--wb-roxo-vivo)]"
            }`}
          />
          {titulo}
          <span className="ml-auto text-[13px] font-bold tabular-nums text-[var(--wb-tinta-3)]">{n}</span>
        </h2>
        <p className="mt-0.5 text-[13px] text-[var(--wb-tinta-3)]">{vazia ? "Nada por aqui." : nota}</p>
      </div>

      {!vazia && (
        <ul className="mt-1 px-1.5 pb-1.5">
          {blocos.slice(0, 6).map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => irPara(b.id)}
                className="wb-foco flex min-h-11 w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-white/70"
              >
                <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[var(--wb-tinta)]">
                  {b.titulo}
                </span>
                <svg viewBox="0 0 12 12" aria-hidden className="size-3.5 shrink-0 opacity-50">
                  <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
          ))}
          {n > 6 && (
            <li className="px-2.5 py-2 text-[13px] font-medium text-[var(--wb-tinta-3)]">
              e mais {n - 6} abaixo
            </li>
          )}
        </ul>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ ações */

/**
 * As ações de um item, já hierarquizadas.
 *
 * Uma função só decide o que aparece, para as três superfícies (cartão de página, linha de
 * produto, linha de seção) darem sempre a mesma resposta. Regra que a organiza:
 *
 *   pergunta em aberto para você  >  aprovar  >  só olhar
 *
 * Responder ganha de aprovar quando alguém perguntou alguma coisa: aprovar por cima de uma
 * pergunta aberta é como não responder o WhatsApp e mandar um joinha.
 */
function Acoes({
  paginaId,
  secaoId,
  titulo,
  href,
  situacao,
  assunto,
  temPergunta,
  compacto,
}: {
  paginaId: string;
  /** `null` = a página inteira (o botão vale para todas as seções de uma vez). */
  secaoId: string | null;
  titulo: string;
  href?: string;
  situacao: Situacao;
  /** Assunto avulso: quem resolve é quem está com a bola, não sempre o cliente. */
  assunto?: boolean;
  temPergunta?: boolean;
  compacto?: boolean;
}) {
  const a = useAcoes();
  const chave = `${paginaId}/${secaoId ?? "pagina"}`;
  const t = tom(situacao, a.souAgencia);
  const eventos = a.eventosDe(paginaId, secaoId ?? undefined);
  const ultimoAutor = eventos.length ? eventos[eventos.length - 1].autor : null;
  const conversando = eventos.some((e) => e.texto);
  const oc = (acao: string) => a.ocupado === `${chave}/${acao}`;

  /** Só o cliente aprova conteúdo do site. Em assunto avulso, aprova quem está com a bola. */
  const podeAprovar = assunto
    ? t === "voce"
    : !a.souAgencia && (t === "voce" || t === "silencio");
  const podeConfirmar =
    situacao === "aprovado" &&
    (assunto
      ? !!ultimoAutor && LADO[ultimoAutor] !== (a.souAgencia ? "agencia" : "cliente")
      : a.souAgencia);
  const podeDesfazer =
    situacao === "aprovado" &&
    !!ultimoAutor &&
    LADO[ultimoAutor] === (a.souAgencia ? "agencia" : "cliente");

  /**
   * Dentro de uma página aberta, uma parte que ninguém comentou não merece um botão verde
   * preenchido: a página tem oito delas, e oito botões preenchidos empatam entre si e com o
   * botão da página inteira, que é o caminho normal. Ali a aprovação vira contorno; só volta a
   * ser a ação da vez quando aquela parte específica tem conversa esperando por ele.
   */
  const aprovacaoDiscreta = !!compacto && !conversando;

  const escrever = () => a.abrirEscrita(a.escrevendo === chave ? null : chave);
  const rotuloEscrita = conversando ? "Responder" : a.souAgencia ? "Preciso de algo" : "Quero mudar algo";

  const botoes: ReactNode[] = [];

  // 1) A ação principal — no máximo uma, e preenchida.
  if (temPergunta && t === "voce") {
    botoes.push(
      <Botao key="p" peso="destaque" largo={!compacto} onClick={escrever}>
        Responder
      </Botao>,
    );
  } else if (podeAprovar && !aprovacaoDiscreta) {
    botoes.push(
      <Botao
        key="p"
        peso="aprovar"
        largo={!compacto}
        ocupado={oc("aprovado")}
        onClick={() => a.registrar(paginaId, secaoId, "aprovado")}
      >
        {oc("aprovado") ? "Guardando…" : assunto ? "Está resolvido" : "Está tudo certo"}
      </Botao>,
    );
  } else if (podeConfirmar) {
    botoes.push(
      <Botao
        key="p"
        peso="destaque"
        largo={!compacto}
        ocupado={oc("confirmado")}
        onClick={() => a.registrar(paginaId, secaoId, "confirmado")}
      >
        {assunto ? "Pode fechar" : "Agradecer e fechar"}
      </Botao>,
    );
  } else if (a.souAgencia && t === "voce" && !assunto) {
    botoes.push(
      <Botao
        key="p"
        peso="atencao"
        largo={!compacto}
        ocupado={oc("ajustado")}
        onClick={() => a.registrar(paginaId, secaoId, "ajustado", "Já arrumei, pode conferir.")}
      >
        Já arrumei
      </Botao>,
    );
  }

  // 2) As alternativas — contorno, todas do mesmo peso entre si.
  const secundarios: ReactNode[] = [];
  if (href) {
    secundarios.push(
      <LinkSaida key="ver" href={href}>
        Ver no site
      </LinkSaida>,
    );
  }
  if (podeAprovar && aprovacaoDiscreta) {
    secundarios.push(
      <Botao
        key="ok"
        peso="sim"
        ocupado={oc("aprovado")}
        onClick={() => a.registrar(paginaId, secaoId, "aprovado")}
      >
        {assunto ? "Está resolvido" : "Está certo"}
      </Botao>,
    );
    secundarios.push(
      <Botao key="esc" onClick={escrever}>
        {rotuloEscrita}
      </Botao>,
    );
  } else if (temPergunta && t === "voce" && podeAprovar) {
    secundarios.push(
      <Botao
        key="ok"
        peso="sim"
        ocupado={oc("aprovado")}
        onClick={() => a.registrar(paginaId, secaoId, "aprovado")}
      >
        Está tudo certo
      </Botao>,
    );
  } else {
    secundarios.push(
      <Botao key="esc" onClick={escrever}>
        {rotuloEscrita}
      </Botao>,
    );
  }
  if (podeDesfazer) {
    secundarios.push(
      <Botao
        key="und"
        peso="discreto"
        ocupado={oc("desfeito")}
        onClick={() => a.registrar(paginaId, secaoId, "desfeito")}
      >
        Voltar atrás
      </Botao>,
    );
  }

  const erro = a.erroDe(chave);

  return (
    <>
      {/* Empilhado no polegar, em linha no desktop: a ação da vez em cima, as alternativas
          embaixo, e nunca dois botões preenchidos disputando a mesma altura. */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {botoes}
        <div className="flex flex-wrap gap-2">{secundarios}</div>
      </div>
      {/* O aviso nasce aqui, encostado no botão que falhou — não no topo do documento. */}
      {erro && !a.escrevendo && <Aviso>{erro}</Aviso>}
      {a.escrevendo === chave && (
        <Campo
          valor={a.rascunho}
          onChange={a.setRascunho}
          onCancelar={() => a.abrirEscrita(null)}
          onEnviar={() =>
            a.registrar(paginaId, secaoId, conversando ? "resposta" : "alteracao", a.rascunho)
          }
          ocupado={oc("resposta") || oc("alteracao")}
          erro={erro}
          assinatura={apelido(a.autor)}
          dica={conversando ? "Sua resposta" : `O que precisa mudar em “${titulo}”?`}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ pergunta aberta */

/** A última fala pendente, na frente do cartão. Toca para ver a conversa inteira. */
function PerguntaAberta({
  ev,
  parte,
  praVoce,
  abrir,
}: {
  ev: Evento;
  parte: string;
  praVoce: boolean;
  abrir: () => void;
}) {
  return (
    <button
      type="button"
      onClick={abrir}
      className={`wb-foco mt-3 block w-full rounded-xl border-l-4 px-3.5 py-3 text-left transition-colors ${
        praVoce
          ? "border-[var(--wb-ambar-borda)] bg-[var(--wb-ambar-leve)] hover:bg-[#fff0d2]"
          : "border-[var(--wb-roxo-vivo)] bg-[var(--wb-roxo-leve)] hover:bg-[#efe4f7]"
      }`}
    >
      <p className="flex items-baseline gap-x-1.5 text-[12.5px] font-semibold text-[var(--wb-tinta-2)]">
        <span className="text-[var(--wb-tinta)]">{apelido(ev.autor)}</span>
        <span className="font-medium">{ev.acao === "ajustado" ? "arrumou" : "escreveu"}</span>
        <span className="font-medium" suppressHydrationWarning>
          {haQuanto(ev.em)}
        </span>
      </p>
      {/* Em qual parte da página — numa linha só, truncada: é referência, não leitura. */}
      {parte && (
        <p className="truncate text-[12.5px] font-medium text-[var(--wb-tinta-3)]">em “{parte}”</p>
      )}
      <p className="mt-1 line-clamp-3 whitespace-pre-line text-[15px] leading-relaxed text-[var(--wb-tinta)]">
        {ev.texto}
      </p>
      <span className="mt-1.5 inline-block text-[13px] font-bold text-[var(--wb-roxo-vivo)] underline underline-offset-4">
        {praVoce ? "ler tudo e responder" : "ver a conversa"}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ cartão de página */

function CartaoPagina({
  b,
  i,
  situacao,
  aberto,
  alternar,
  aberta,
}: {
  b: Bloco;
  i: number;
  situacao: Situacao;
  aberto: boolean;
  alternar: () => void;
  aberta?: { ev: Evento; parte: string };
}) {
  const a = useAcoes();
  const t = tom(situacao, a.souAgencia);
  const prontas = b.itens.filter((it) =>
    ["aprovado", "fechado"].includes(a.sit(b.id, it.id)),
  ).length;

  // O item "página inteira" só entra na lista quando tem conversa: nascer vazio confundia.
  const partes = [
    ...b.itens,
    { id: ITEM_PAGINA, titulo: "Sobre a página inteira" },
  ].filter((it) => it.id !== ITEM_PAGINA || a.eventosDe(b.id, ITEM_PAGINA).length > 0);

  return (
    <li
      id={`bloco-${b.id}`}
      style={{ "--i": Math.min(i, 10), "--wb-cor-trilho": TRILHO[t] } as React.CSSProperties}
      className={`wb-entra wb-cartao wb-trilho wb-alvo overflow-hidden rounded-2xl border border-[var(--wb-linha)] bg-white shadow-[0_8px_24px_-20px_rgba(53,5,69,0.55)] ${
        a.flash === `${b.id}/pagina` ? "wb-flash" : ""
      }`}
    >
      <div className="p-4 pl-5 sm:p-5 sm:pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[18px] font-bold leading-tight text-[var(--wb-tinta)] [text-wrap:balance]">
              {b.titulo}
            </h3>
            <p className="mt-1 text-[13px] text-[var(--wb-tinta-3)]">
              {b.itens.length} {b.itens.length === 1 ? "parte" : "partes"}
              {prontas > 0 && ` · ${prontas} já aprovada${prontas > 1 ? "s" : ""}`}
              {t === "silencio" && " · ainda não olhada"}
            </p>
          </div>
          <Selo situacao={situacao} souAgencia={a.souAgencia} />
        </div>

        {aberta && (
          <PerguntaAberta
            ev={aberta.ev}
            parte={aberta.parte}
            praVoce={t === "voce"}
            abrir={() => {
              if (!aberto) alternar();
              requestAnimationFrame(() =>
                document
                  .getElementById(`parte-${b.id}-${aberta.ev.secaoId}`)
                  ?.scrollIntoView({ block: "center", behavior: "smooth" }),
              );
            }}
          />
        )}

        <Acoes
          paginaId={b.id}
          secaoId={null}
          titulo={b.titulo}
          href={b.href}
          situacao={situacao}
          temPergunta={!!aberta}
        />

        {b.itens.length > 1 && (
          <button
            type="button"
            onClick={alternar}
            aria-expanded={aberto}
            aria-controls={`partes-${b.id}`}
            className="wb-foco -ml-2 mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-[14px] font-semibold text-[var(--wb-tinta-3)] transition-colors hover:text-[var(--wb-roxo)]"
          >
            {aberto ? "esconder as partes" : `ver as ${b.itens.length} partes desta página`}
            <svg
              viewBox="0 0 12 12"
              aria-hidden
              className={`size-3.5 transition-transform duration-300 ${aberto ? "rotate-180" : ""}`}
            >
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <Sanfona aberta={aberto} id={`partes-${b.id}`}>
        <ul className="divide-y divide-[var(--wb-linha)] border-t border-[var(--wb-linha)] bg-[var(--wb-fundo)]">
          {partes.map((it) => (
            <LinhaParte key={it.id} blocoId={b.id} item={it} />
          ))}
        </ul>
      </Sanfona>
    </li>
  );
}

/** Uma seção dentro da página aberta. */
function LinhaParte({ blocoId, item }: { blocoId: string; item: Item }) {
  const a = useAcoes();
  const situacao = a.sit(blocoId, item.id);
  const t = tom(situacao, a.souAgencia);
  const eventos = a.eventosDe(blocoId, item.id);

  return (
    <li id={`parte-${blocoId}-${item.id}`} className="wb-alvo px-4 py-4 sm:px-5">
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-1.5 size-2.5 shrink-0 rounded-full ${PONTO[t]}`}
          role="img"
          aria-label={rotulo(situacao, a.souAgencia)}
        />
        <p className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-[var(--wb-tinta)]">
          {item.titulo}
        </p>
      </div>
      <Conversa eventos={eventos} souAgencia={a.souAgencia} />
      <div className="pl-5">
        {/* Sem "Ver no site" aqui: é o mesmo endereço do cartão, e repeti-lo em cada uma das
            oito partes só acrescentava oito botões idênticos ao caminho do polegar. */}
        <Acoes
          paginaId={blocoId}
          secaoId={item.id}
          titulo={item.titulo}
          situacao={situacao}
          compacto
          temPergunta={t === "voce" && eventos.some((e) => e.texto)}
        />
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ lista compacta */

/**
 * Produtos e assuntos avulsos.
 *
 * As 45 páginas de produto ocupavam 70% do documento como cartões altos com um subtítulo
 * genérico ("Texto, fotos e tudo o que estiver nesta página") repetido 45 vezes e o nome do
 * produto cortado. Viram linhas de uma lista só: o nome do produto é o título, nada é
 * escondido, e a altura cai de ~163px para ~60px por item.
 */
function GrupoCompacto({
  blocos,
  sitBloco,
  emAberto,
  aberta,
  setAberta,
  assuntos,
}: {
  blocos: Bloco[];
  sitBloco: (b: Bloco) => Situacao;
  emAberto: Map<string, { ev: Evento; parte: string }>;
  aberta: string | null;
  setAberta: (id: string | null) => void;
  assuntos?: boolean;
}) {
  // Os assuntos avulsos vivem todos dentro de um bloco só; os produtos são um bloco cada.
  const linhas = assuntos
    ? (blocos[0]?.itens ?? []).map((it) => ({
        chave: `${PAGINA_PENDENCIAS}/${it.id}`,
        paginaId: PAGINA_PENDENCIAS,
        secaoId: it.id,
        titulo: it.titulo,
        href: undefined as string | undefined,
      }))
    : blocos.map((b) => ({
        chave: b.id,
        paginaId: b.id,
        secaoId: null as string | null,
        titulo: b.titulo,
        href: b.href,
      }));

  return (
    <ul className="wb-entra mt-3 divide-y divide-[var(--wb-linha)] overflow-hidden rounded-2xl border border-[var(--wb-linha)] bg-white shadow-[0_8px_24px_-20px_rgba(53,5,69,0.55)]">
      {linhas.map((l) => (
        <LinhaCompacta
          key={l.chave}
          paginaId={l.paginaId}
          secaoId={l.secaoId}
          titulo={l.titulo}
          href={l.href}
          assunto={!!assuntos}
          situacao={
            assuntos
              ? undefined
              : sitBloco(blocos.find((b) => b.id === l.paginaId)!)
          }
          aberta={!assuntos ? emAberto.get(l.paginaId) : undefined}
          aberto={aberta === l.chave}
          alternar={() => setAberta(aberta === l.chave ? null : l.chave)}
        />
      ))}
    </ul>
  );
}

function LinhaCompacta({
  paginaId,
  secaoId,
  titulo,
  href,
  assunto,
  situacao,
  aberta,
  aberto,
  alternar,
}: {
  paginaId: string;
  secaoId: string | null;
  titulo: string;
  href?: string;
  assunto: boolean;
  situacao?: Situacao;
  aberta?: { ev: Evento; parte: string };
  aberto: boolean;
  alternar: () => void;
}) {
  const a = useAcoes();
  const chave = `${paginaId}/${secaoId ?? "pagina"}`;
  const s = situacao ?? a.sit(paginaId, secaoId ?? ITEM_PAGINA);
  const t = tom(s, a.souAgencia);
  const eventos = a.eventosDe(paginaId, secaoId ?? undefined);
  const ultima = [...eventos].reverse().find((e) => e.texto);
  const temPergunta = t === "voce" && !!ultima;

  return (
    <li
      id={`bloco-${paginaId}`}
      style={{ "--wb-cor-trilho": TRILHO[t] } as React.CSSProperties}
      className={`wb-trilho wb-alvo ${t === "voce" ? "bg-[var(--wb-ambar-leve)]/50" : ""} ${
        a.flash === chave ? "wb-flash" : ""
      }`}
    >
      <div className="flex items-stretch gap-1 pl-1.5">
        <button
          type="button"
          onClick={alternar}
          aria-expanded={aberto}
          aria-controls={`linha-${chave}`}
          // `min-w-0` é obrigatório: sem ele o botão é um item flex cujo tamanho mínimo é o do
          // seu conteúdo, o resumo de uma linha não trunca e empurra a seta e o "ver no site"
          // para fora do cartão.
          className="wb-foco flex min-h-[60px] min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
        >
          <span
            className={`size-2.5 shrink-0 rounded-full ${PONTO[t]}`}
            role="img"
            aria-label={rotulo(s, a.souAgencia)}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold leading-snug text-[var(--wb-tinta)]">
              {titulo}
            </span>
            {/* Uma linha do que ficou pendente: evita ter de abrir para saber se há algo. */}
            {ultima && !aberto && (
              <span className="mt-0.5 block truncate text-[12.5px] text-[var(--wb-tinta-3)]">
                {apelido(ultima.autor)}: {ultima.texto}
              </span>
            )}
            {t === "pronto" && !ultima && (
              <span className="mt-0.5 block text-[12.5px] font-medium text-[var(--wb-verde-tinta)]">
                pronto
              </span>
            )}
          </span>
          <svg
            viewBox="0 0 12 12"
            aria-hidden
            className={`size-3.5 shrink-0 text-[var(--wb-tinta-3)] transition-transform duration-300 ${
              aberto ? "rotate-180" : ""
            }`}
          >
            <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Ver ${titulo} no site`}
            // Ícone só no celular, onde 41 rótulos repetidos roubariam a largura do nome do
            // produto; com espaço de sobra, o rótulo volta e o botão para de ser um enigma.
            className="wb-foco my-2 mr-1 inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl px-0 text-[14px] font-semibold text-[var(--wb-roxo)] ring-1 ring-[var(--wb-linha)] transition-colors hover:bg-[var(--wb-roxo-leve)] hover:ring-[var(--wb-roxo-borda)] max-sm:w-11 sm:px-3.5"
          >
            <span className="max-sm:sr-only">Ver no site</span>
            <svg viewBox="0 0 14 14" aria-hidden className="size-4 shrink-0">
              <path d="M5 2h7v7M12 2L4 10M9 12H2V5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only">{titulo} (abre em outra aba)</span>
          </a>
        )}
      </div>

      <Sanfona aberta={aberto} id={`linha-${chave}`}>
        <div className="border-t border-[var(--wb-linha)] bg-[var(--wb-fundo)] px-4 pb-4 pt-1 sm:px-5">
          <Conversa eventos={eventos} souAgencia={a.souAgencia} />
          <Acoes
            paginaId={paginaId}
            secaoId={secaoId}
            titulo={titulo}
            href={href}
            situacao={s}
            assunto={assunto}
            compacto
            temPergunta={temPergunta || (!!aberta && t === "voce")}
          />
        </div>
      </Sanfona>
    </li>
  );
}

/* ------------------------------------------------------------------ sanfona */

/**
 * `inert` é a peça que faltava: fechada, a sanfona continuava no caminho do Tab e do leitor de
 * tela — 400 elementos fantasma. Com `inert` o conteúdo some das duas navegações, sem sair do
 * DOM (e sem perder a animação de altura).
 */
function Sanfona({
  aberta,
  id,
  children,
}: {
  aberta: boolean;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="wb-sanfona" data-aberta={aberta}>
      <div id={id} inert={!aberta}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ novo assunto */

function NovoAssunto({
  aberto,
  abrir,
  rascunho,
  setRascunho,
  registrar,
  ocupado,
  erro,
  autor,
}: {
  aberto: boolean;
  abrir: (v: boolean) => void;
  rascunho: string;
  setRascunho: (v: string) => void;
  registrar: (p: string, s: string | null, a: string, t?: string) => void;
  ocupado: string | null;
  erro: string | null;
  autor: Autor;
}) {
  return (
    <section className="mt-9 rounded-2xl border border-dashed border-[var(--wb-lilas)] bg-white/60 p-4 sm:p-5">
      <h2 className="text-[15px] font-bold text-[var(--wb-tinta)]">
        Precisa falar de algo que não é de nenhuma página?
      </h2>
      <p className="mt-1 text-[14px] leading-relaxed text-[var(--wb-tinta-2)]">
        Acesso, prazo, domínio, material que falta — abra aqui que entra na mesma lista e não se
        perde.
      </p>
      {aberto ? (
        <div className="mt-3">
          <label htmlFor="novo-assunto" className="block text-[14px] font-semibold text-[var(--wb-tinta)]">
            Do que se trata?
          </label>
          <input
            id="novo-assunto"
            value={rascunho}
            onChange={(e) => setRascunho(e.target.value)}
            autoFocus
            placeholder="Ex.: me colocar como contato técnico do domínio no registro.br"
            className="wb-foco mt-2 w-full rounded-xl border border-[var(--wb-lilas)] bg-white px-3 py-3 text-[16px] text-[var(--wb-tinta)] placeholder:text-[var(--wb-tinta-3)] focus:border-[var(--wb-roxo-vivo)] focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Botao
              peso="destaque"
              disabled={!rascunho.trim()}
              ocupado={!!ocupado?.endsWith("/criado")}
              onClick={() =>
                registrar(PAGINA_PENDENCIAS, `p-${Date.now().toString(36)}`, "criado", rascunho)
              }
            >
              Abrir assunto
            </Botao>
            <Botao peso="discreto" onClick={() => abrir(false)}>
              Cancelar
            </Botao>
            <span className="ml-auto text-[12.5px] text-[var(--wb-tinta-3)]">
              assinando como <strong className="font-semibold">{apelido(autor)}</strong>
            </span>
          </div>
          {erro && <Aviso>{erro}</Aviso>}
        </div>
      ) : (
        <Botao className="mt-3" onClick={() => { abrir(true); setRascunho(""); }}>
          Abrir um assunto
        </Botao>
      )}
    </section>
  );
}

export { NOME_CLIENTE, NOME_AGENCIA };
