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
  useEffect,
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
  TRILHO,
  apelido,
  haQuanto,
  rotulo,
  tom,
  type Tom,
} from "./ui";

type Item = SecaoRevisao;
type Bloco = { id: string; titulo: string; href?: string; grupo: string; itens: Item[] };

/**
 * As contagens de uma página, todas tiradas da MESMA lista de partes.
 *
 * Existe como tipo para que fila e cartão não possam divergir de novo: quem quiser mostrar um
 * número de partes recebe este objeto inteiro, e não tem como inventar outra conta.
 */
type Contagem = { total: number; aprovadas: number; cliente: number; agencia: number };

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
  abrirEscrita: (chave: string | null, respondeA?: string | null) => void;
  rascunho: string;
  setRascunho: (v: string) => void;
  registrar: (
    paginaId: string,
    secaoId: string | null,
    acao: string,
    texto?: string,
    respondeA?: string | null,
  ) => void;
  respondendoA: string | null;
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
  /**
   * A página aberta — uma de cada vez, e a primeira já aberta ao carregar.
   *
   * **Por que uma só.** São 56 páginas. Um cartão aberto no celular passa de 600px, e com dois
   * ou três abertos a lista vira de novo o rolo infinito de que ele reclamou: ele perde o lugar
   * onde estava e a próxima página fica a três deslizadas de distância. Fechar a anterior
   * mantém a regra de que a lista cabe no polegar e que o item aberto é sempre o assunto da vez.
   * O painel já trabalhava assim internamente (um `aberta` só), agora isso está visível.
   *
   * A Home nasce aberta porque uma lista inteira fechada não ensina que os cartões abrem.
   */
  const [aberta, setAberta] = useState<string | null>(paginasRevisao[0]?.id ?? null);
  /** Dentro da página aberta, se a lista de partes está estendida. Segundo nível, opcional. */
  const [partesAbertas, setPartesAbertas] = useState<string | null>(null);
  /** Grupos recolhidos/estendidos à mão. Sem entrada aqui, vale o padrão de `grupoAberto`. */
  const [gruposAbertos, setGruposAbertos] = useState<Record<string, boolean>>({});
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [erro, setErro] = useState<{ alvo: string; msg: string } | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [escrevendo, setEscrevendo] = useState<string | null>(null);
  /** Id da fala que a escrita aberta responde. Null = fala nova, solta na seção. */
  const [respondendoA, setRespondendoA] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState("");
  const [novoAssunto, setNovoAssunto] = useState(false);
  /**
   * Quantos eventos existem no servidor, quando é mais do que temos aqui.
   *
   * A tela NÃO se atualiza sozinha, de propósito: se o registro mudasse debaixo de quem está
   * lendo ou escrevendo, o cartão aberto podia pular de fila e sumir. Só acende um aviso, e
   * quem decide atualizar é a pessoa.
   */
  const [novidades, setNovidades] = useState(0);
  const [atualizando, setAtualizando] = useState(false);

  const souAgencia = LADO[autor] === "agencia";

  /**
   * Confere se o registro cresceu, e só acende o aviso.
   *
   * **Sem temporizador, de propósito.** A primeira versão perguntava a cada 30 segundos. Cada
   * pergunta é uma operação avançada do Blob, e o plano gratuito dá 2.000 por mês para a conta
   * inteira: uma aba esquecida aberta gastaria 2.880 num único dia. Mesmo a cada cinco minutos,
   * duas abas num dia de trabalho passariam do mês. Em 16/09/2026 a cota estourou por outro
   * motivo e suspendeu os armazenamentos de todos os clientes da conta; este relógio teria feito
   * de novo, sozinho.
   *
   * Então pergunta em dois momentos: ao abrir, e quando a aba volta a ficar visível. É quando há
   * alguém olhando. Quem quiser conferir no meio do caminho clica no botão, que sempre funciona.
   */
  useEffect(() => {
    let vivo = true;
    const conferir = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const r = await fetch("/api/revisao/novidades", { cache: "no-store" });
        const d = await r.json();
        if (vivo && typeof d?.total === "number") {
          setNovidades(d.total > eventos.length ? d.total - eventos.length : 0);
        }
      } catch {
        // Sem rede a tela continua servindo para ler e escrever: o aviso apenas não acende.
      }
    };
    document.addEventListener("visibilitychange", conferir);
    conferir();
    return () => {
      vivo = false;
      document.removeEventListener("visibilitychange", conferir);
    };
  }, [eventos.length]);

  /** Baixa o registro e substitui o que está na tela. Só roda quando a pessoa clica. */
  const atualizar = useCallback(async () => {
    setAtualizando(true);
    try {
      const r = await fetch("/api/revisao", { cache: "no-store" });
      const d = await r.json();
      if (Array.isArray(d?.eventos)) {
        setEventos(d.eventos);
        if (d.situacoes) setSituacoes(d.situacoes);
        setNovidades(0);
      }
    } catch {
      // Mantém o aviso aceso para a pessoa tentar de novo.
    } finally {
      setAtualizando(false);
    }
  }, []);

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
    async (
      paginaId: string,
      secaoId: string | null,
      acao: string,
      texto?: string,
      respondeA?: string | null,
    ) => {
      const alvo = `${paginaId}/${secaoId ?? "pagina"}`;
      setOcupado(`${alvo}/${acao}`);
      setErro(null);
      try {
        const r = await fetch("/api/revisao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paginaId, secaoId, acao, autor, texto, respondeA: respondeA ?? undefined }),
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

  const abrirEscrita = useCallback((chave: string | null, respondeA?: string | null) => {
    setEscrevendo(chave);
    setRespondendoA(respondeA ?? null);
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

  /**
   * As partes de uma página — uma definição só, usada em todo lugar.
   *
   * É aqui que mora o conserto do bug que ele apontou: a fila dizia "7 partes" e o cartão da
   * mesma Home dizia "10 partes". Os dois números estavam certos e nasciam de listas
   * diferentes — a fila contava o que estava pendente daquele lado, o cartão contava as seções
   * da página — e nada na tela dizia isso. Agora existe UMA lista de partes (as seções, mais o
   * item "página inteira" quando ele tem conversa) e todas as contagens saem dela, de modo que
   * "7" e "10" passam a ser dois números da mesma conta: 7 de 10.
   */
  const situacoesDe = useCallback(
    (b: Bloco): Situacao[] => {
      const s = b.itens.map((i) => sit(b.id, i.id));
      // O item da página inteira só conta quando existe de fato: nascer vazio inflava o total.
      if ((porPagina.get(b.id) ?? []).some((e) => e.secaoId === ITEM_PAGINA)) {
        s.push(sit(b.id, ITEM_PAGINA));
      }
      return s;
    },
    [porPagina, sit],
  );

  /** Total, aprovadas e quantas partes cada lado ainda segura. O cartão e a fila leem daqui. */
  const contar = useCallback(
    (b: Bloco): Contagem => {
      const s = situacoesDe(b);
      return {
        total: s.length,
        aprovadas: s.filter((x) => x === "aprovado" || x === "fechado").length,
        cliente: s.filter((x) => x === "com-cliente").length,
        agencia: s.filter((x) => x === "com-agencia").length,
      };
    },
    [situacoesDe],
  );

  /** O pior estado manda: uma bola pendente deixa a página pendente na lista. */
  const sitBloco = useCallback(
    (b: Bloco): Situacao => {
      const s = situacoesDe(b);
      // Conversa aberta vem antes de tudo: é a única coisa que exige ação de alguém agora.
      if (s.includes("com-cliente")) return "com-cliente";
      if (s.includes("com-agencia")) return "com-agencia";
      if (!s.length) return "novo";
      if (s.every((x) => x === "fechado")) return "fechado";
      if (s.every((x) => x === "aprovado" || x === "fechado")) return "aprovado";
      return "novo";
    },
    [situacoesDe],
  );

  /**
   * Os lados que a página ainda segura — pode ser mais de um.
   *
   * `sitBloco` devolve UM estado, porque o selo do cartão é um só. Mas uma página com oito
   * partes pode, ao mesmo tempo, ter algo esperando o cliente e algo esperando a gente. Colapsar
   * isso num estado só fazia a pendência da agência DESAPARECER da fila "Esperando a WB", porque
   * "com-cliente" vinha primeiro no desempate. Aconteceu em 18/09/2026 com Películas Automotivas:
   * respondemos uma parte, e as outras duas que ainda devíamos sumiram da nossa fila.
   *
   * Uma ferramenta de aprovação que esconde o que falta não serve para nada. Então a página entra
   * nas duas filas quando deve às duas.
   */
  const pendencias = useCallback(
    (b: Bloco): Set<Situacao> =>
      new Set(situacoesDe(b).filter((s) => s === "com-cliente" || s === "com-agencia")),
    [situacoesDe],
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
      // Guardadas as duas: a última fala pendente de cada lado. Quem lê vê primeiro a sua
      // própria dívida — mostrar a do outro lado quando existe a nossa escondia o trabalho.
      const ultimo: Partial<Record<Situacao, Evento>> = {};
      for (const e of porPagina.get(b.id) ?? []) {
        if (!e.secaoId || !e.texto) continue;
        const s = sit(b.id, e.secaoId);
        if (s !== "com-cliente" && s !== "com-agencia") continue;
        // `eventos` já vem ordenado por data; o último que passar no filtro é o mais recente.
        ultimo[s] = e;
      }
      // Com um lado filtrado, o trecho tem que ser o DAQUELE lado: clicar em "Esperando a WB"
      // e ler no cartão a pendência do cliente é o filtro se contradizendo. Sem filtro, vale a
      // dívida de quem está lendo.
      const meu: Situacao =
        filtro === "voce" || filtro === "eles"
          ? ((filtro === "voce") === souAgencia ? "com-agencia" : "com-cliente")
          : souAgencia
            ? "com-agencia"
            : "com-cliente";
      const outro: Situacao = meu === "com-agencia" ? "com-cliente" : "com-agencia";
      const ev = ultimo[meu] ?? ultimo[outro];
      if (ev) {
        m.set(b.id, {
          ev,
          parte: ev.secaoId === ITEM_PAGINA ? "" : (titulos.get(ev.secaoId!) ?? ""),
        });
      }
    }
    return m;
  }, [blocos, filtro, porPagina, sit, souAgencia]);

  /**
   * O andamento, medido pelo que de fato anda.
   *
   * A barra antiga contava só páginas 100% aprovadas — e uma página só fica aprovada quando
   * TODAS as partes dela fecham. Depois de 16 dias de conversa, 72 registros e 30 ajustes
   * entregues, ela marcava "0 de 56 · 0%", o que é literalmente verdade e mente sobre o
   * trabalho: dá a impressão de que nada aconteceu. É um indicador atrasado.
   *
   * Agora as 56 páginas são repartidas em três estados, e a barra mostra os três. Página com
   * conversa aberta aparece como conversa — que é o que ela é — em vez de se somar às que
   * ninguém abriu ainda.
   */
  const paginas = useMemo(() => blocos.filter((b) => !!b.href), [blocos]);
  const resumo = useMemo(() => {
    let prontas = 0;
    let conversa = 0;
    for (const b of paginas) {
      if (["aprovado", "fechado"].includes(sitBloco(b))) prontas++;
      else if ((porPagina.get(b.id) ?? []).length > 0) conversa++;
    }
    return { prontas, conversa, intocadas: paginas.length - prontas - conversa, total: paginas.length };
  }, [paginas, porPagina, sitBloco]);

  /** Quantas páginas cada grupo tem no total, para o título do grupo dizer se está filtrado. */
  const totalPorGrupo = useMemo(() => {
    const m = new Map<string, number>();
    for (const b of blocos) m.set(b.grupo, (m.get(b.grupo) ?? 0) + 1);
    return m;
  }, [blocos]);

  /** Contagem por tom — é o que rotula os filtros e a chamada do topo. */
  const contagem = useMemo(() => {
    const c: Record<Tom, number> = { silencio: 0, voce: 0, eles: 0, aprovado: 0, pronto: 0 };
    for (const b of blocos) {
      const p = pendencias(b);
      // Página que deve aos dois conta nos dois chips. O número do chip precisa bater com a
      // lista que ele abre, senão o filtro mente.
      if (p.size) {
        for (const s of p) c[tom(s, souAgencia)]++;
      } else {
        c[tom(sitBloco(b), souAgencia)]++;
      }
    }
    return c;
  }, [blocos, pendencias, sitBloco, souAgencia]);

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
    () => blocos.filter((b) => pendencias(b).has("com-cliente")),
    [blocos, pendencias],
  );
  // "aprovado" entra na fila da WB: o cliente já falou, falta a gente confirmar e fechar.
  const comAgencia = useMemo(
    () => blocos.filter((b) => pendencias(b).has("com-agencia") || sitBloco(b) === "aprovado"),
    [blocos, pendencias, sitBloco],
  );

  const combina = useCallback(
    (b: Bloco) => {
      if (filtro === "tudo") return true;
      const t = tom(sitBloco(b), souAgencia);
      if (filtro === "pronto") return t === "aprovado" || t === "pronto";
      if (filtro === "novo") return t === "silencio";
      // "voce"/"eles" olham TODAS as pendências da página, não só a que ganhou o desempate
      // do selo. É o que faz a página aparecer nos dois chips quando deve aos dois lados.
      const p = pendencias(b);
      if (p.size) return [...p].some((s) => tom(s, souAgencia) === filtro);
      return t === filtro;
    },
    [filtro, pendencias, sitBloco, souAgencia],
  );

  const grupos = useMemo(() => {
    const m = new Map<string, Bloco[]>();
    for (const b of blocos) if (combina(b)) m.set(b.grupo, [...(m.get(b.grupo) ?? []), b]);
    // Ordem de leitura: as páginas do site primeiro, os assuntos avulsos depois, e só então os
    // 45 produtos — que são volume, não prioridade.
    const peso = (g: string) => (g === "Páginas do site" ? 0 : g === GRUPO_ASSUNTOS ? 1 : 2);
    return [...m.entries()].sort((a, b) => peso(a[0]) - peso(b[0]));
  }, [blocos, combina]);

  /**
   * Grupo aberto ou fechado.
   *
   * As 41 páginas de Som e Acessórios são 2.500px de lista no celular, todas em silêncio, e
   * ficam entre ele e o fim da página. Grupo grande nasce fechado, com o número do lado; grupo
   * pequeno — ou grupo que um filtro já encurtou — nasce aberto, porque aí não custa nada.
   */
  const grupoAberto = useCallback(
    (grupo: string, quantos: number) =>
      gruposAbertos[grupo] ??
      (grupo === "Páginas do site" || grupo === GRUPO_ASSUNTOS || quantos <= 12),
    [gruposAbertos],
  );

  /**
   * Abre uma página e leva a tela até ela.
   *
   * O `scrollIntoView` deixou de ser enfeite quando os cartões passaram a fechar: ao abrir um
   * cartão lá embaixo, o que estava aberto lá em cima encolhe e a página inteira sobe debaixo
   * do dedo. Rolar até o cartão recém-aberto devolve o lugar dele à tela.
   */
  const abrirPagina = useCallback(
    (id: string, comPartes?: boolean) => {
      setAberta(id);
      if (comPartes) setPartesAbertas(id);
      // O grupo pode estar recolhido — um produto pendente mora dentro dos 41 de Som e
      // Acessórios. Sem isto o atalho da fila levaria a um elemento de altura zero.
      const grupo = blocos.find((b) => b.id === id)?.grupo;
      const precisaAbrirGrupo = !!grupo && !grupoAberto(grupo, 99);
      if (grupo) setGruposAbertos((m) => ({ ...m, [grupo]: true }));
      const rolar = () =>
        document.getElementById(`bloco-${id}`)?.scrollIntoView({ block: "start", behavior: "smooth" });
      // Se o grupo estava fechado, a sanfona ainda está abrindo (300ms) e o destino tem altura
      // zero: rolar antes disso não leva a lugar nenhum.
      if (precisaAbrirGrupo) setTimeout(rolar, 340);
      else requestAnimationFrame(rolar);
    },
    [blocos, grupoAberto],
  );

  /** Alterna um cartão. Ao fechar, a lista de partes daquele cartão fecha junto. */
  const alternarPagina = useCallback(
    (id: string) => {
      if (aberta === id) {
        setAberta(null);
        setPartesAbertas((p) => (p === id ? null : p));
        return;
      }
      abrirPagina(id);
    },
    [aberta, abrirPagina],
  );

  const acoes: Acoes = {
    autor,
    souAgencia,
    ocupado,
    erroDe,
    flash,
    escrevendo,
    abrirEscrita,
    respondendoA,
    rascunho,
    setRascunho,
    registrar,
    sit,
    eventosDe,
  };

  return (
    <Ctx.Provider value={acoes}>
      <div className="mx-auto max-w-4xl px-4 pb-28 sm:px-6">
        <Abertura autor={autor} setAutor={setAutor} resumo={resumo} />

        <BarraFiltros
          filtro={filtro}
          setFiltro={setFiltro}
          contagem={contagem}
          totalBlocos={blocos.length}
          souAgencia={souAgencia}
          novidades={novidades}
          atualizar={atualizar}
          atualizando={atualizando}
        />

        {filtro === "tudo" && (comCliente.length > 0 || comAgencia.length > 0) && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Fila
              titulo={`Esperando ${NOME_CLIENTE}`}
              nota="Precisa de aprovação ou resposta de vocês."
              blocos={comCliente}
              lado="cliente"
              souAgencia={souAgencia}
              irPara={abrirPagina}
              contar={contar}
            />
            <Fila
              // "WB Digital Solutions" por extenso quebrava o título em duas linhas dentro da
              // caixa. Os chips, os selos e a linha do cartão já dizem "a WB": é como ele nos
              // chama, e um nome só em toda a tela é menos coisa para decifrar.
              titulo="Esperando a WB"
              nota="Estamos resolvendo por aqui."
              blocos={comAgencia}
              lado="agencia"
              souAgencia={souAgencia}
              irPara={abrirPagina}
              contar={contar}
            />
          </div>
        )}

        {grupos.map(([grupo, itens]) => {
          const g = grupoAberto(grupo, itens.length);
          return (
            <section key={grupo} className="mt-9">
              <TituloDeGrupo
                grupo={grupo}
                quantos={itens.length}
                totalGrupo={totalPorGrupo.get(grupo) ?? itens.length}
                aprovadas={itens.filter((b) => ["aprovado", "fechado"].includes(sitBloco(b))).length}
                aberto={g}
                alternar={() => setGruposAbertos((m) => ({ ...m, [grupo]: !g }))}
              />

              <Sanfona aberta={g} id={`grupo-${grupo.replace(/\W+/g, "-")}`}>
                {grupo === "Páginas do site" ? (
                  <ul className="mt-3 flex flex-col gap-3">
                    {itens.map((b, i) => (
                      <CartaoPagina
                        key={b.id}
                        b={b}
                        i={i}
                        situacao={sitBloco(b)}
                        contagem={contar(b)}
                        aberto={aberta === b.id}
                        alternar={() => alternarPagina(b.id)}
                        partesAbertas={partesAbertas === b.id}
                        alternarPartes={() =>
                          setPartesAbertas((p) => (p === b.id ? null : b.id))
                        }
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
              </Sanfona>
            </section>
          );
        })}

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
  resumo,
}: {
  autor: Autor;
  setAutor: (a: Autor) => void;
  resumo: { prontas: number; conversa: number; intocadas: number; total: number };
}) {
  const { prontas, conversa, intocadas, total } = resumo;
  const fatia = (n: number) => (total ? (n / total) * 100 : 0);
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
              {/* O rótulo é o mesmo apelido que assina as falas — "Bruno (The Dark Film)" e
                  "Bruno (WB)". Ver no seletor um nome e no balão outro obrigava a traduzir. */}
              {AUTORES.map((a) => (
                <option key={a} value={a}>
                  {apelido(a)}
                </option>
              ))}
            </select>
          </span>
        </label>

        {/*
          Três estados, não um.
          A barra antiga só enchia quando a página inteira fechava, e por isso marcava 0% depois
          de duas semanas de conversa. Aqui cada página cai num dos três: aprovada, em conversa,
          ou ainda não olhada. O que já aconteceu aparece, e o que falta continua sendo dito.
        */}
        <div className="p-3.5">
          <p className="text-[15px] font-bold text-[var(--wb-tinta)]">
            Andamento das {total} páginas
          </p>
          <div
            className="mt-2 flex h-2.5 gap-px overflow-hidden rounded-full bg-[var(--wb-linha)]"
            role="img"
            aria-label={`${prontas} aprovadas, ${conversa} em conversa, ${intocadas} ainda não olhadas, de ${total} páginas.`}
          >
            {prontas > 0 && (
              <span
                className="block h-full bg-[var(--wb-verde)] transition-[width] duration-700"
                style={{ width: `${fatia(prontas)}%` }}
              />
            )}
            {conversa > 0 && (
              <span
                className="block h-full bg-[var(--wb-ambar-borda)] transition-[width] duration-700"
                style={{ width: `${fatia(conversa)}%` }}
              />
            )}
          </div>
          <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--wb-tinta-2)]">
            {[
              ["bg-[var(--wb-verde)]", prontas, "aprovadas"],
              ["bg-[var(--wb-ambar-borda)]", conversa, "em conversa"],
              ["bg-[var(--wb-linha)]", intocadas, "ainda não olhadas"],
            ].map(([cor, n, texto]) => (
              <li key={texto as string} className="flex items-center gap-1.5">
                <span aria-hidden className={`size-2 shrink-0 rounded-full ${cor}`} />
                <strong className="font-bold tabular-nums text-[var(--wb-tinta)]">{n}</strong>
                {texto}
              </li>
            ))}
          </ul>
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
  novidades,
  atualizar,
  atualizando,
}: {
  filtro: Filtro;
  setFiltro: (f: Filtro) => void;
  contagem: Record<Tom, number>;
  totalBlocos: number;
  souAgencia: boolean;
  novidades: number;
  atualizar: () => void;
  atualizando: boolean;
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
    <div className="sticky top-0 z-30 -mx-4 mt-6 flex items-center gap-2 border-y border-[var(--wb-linha)] bg-[var(--wb-fundo)]/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div
        role="group"
        aria-label="Filtrar a lista"
        className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      {/* Fora da faixa que rola: com muitos filtros os chips somem para o lado, e o botão
          precisa continuar à vista. */}
      <button
        type="button"
        onClick={atualizar}
        disabled={atualizando}
        title={novidades > 0 ? "Há registro novo desde que esta página abriu" : "Buscar o que mudou"}
        className={`wb-foco inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[14px] font-semibold transition-colors duration-150 disabled:opacity-50 ${
          novidades > 0
            ? "bg-[var(--wb-ambar-leve)] text-[var(--wb-ambar-tinta)] ring-1 ring-[var(--wb-ambar-borda)]"
            : "bg-white text-[var(--wb-tinta-2)] ring-1 ring-[var(--wb-linha)] hover:ring-[var(--wb-lilas)]"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`size-4 shrink-0 ${atualizando ? "animate-spin" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M20 11a8 8 0 1 0-.6 4" strokeLinecap="round" />
          <path d="M20 4.5V11h-6.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hidden sm:inline" aria-hidden>
          {atualizando ? "Buscando" : "Atualizar"}
        </span>
        {novidades > 0 && !atualizando && (
          <span
            aria-hidden
            className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--wb-ambar-tinta)] px-1.5 text-[12px] font-bold text-white"
          >
            {novidades}
          </span>
        )}
        <span className="sr-only">
          {novidades > 0
            ? `Atualizar a lista. Há ${novidades} ${novidades === 1 ? "registro novo" : "registros novos"}.`
            : "Atualizar a lista"}
        </span>
      </button>
    </div>
  );
}

/**
 * Cabeçalho de grupo, que também é o botão que recolhe o grupo inteiro.
 *
 * O grupo "Som e Acessórios" tem 41 páginas em silêncio e ficava entre ele e o fim da lista.
 * Recolhido, o painel inteiro cabe em poucas rolagens e os produtos continuam a um toque.
 */
function TituloDeGrupo({
  grupo,
  quantos,
  totalGrupo,
  aprovadas,
  aberto,
  alternar,
}: {
  grupo: string;
  /** Quantos aparecem agora (o filtro pode ter encurtado). */
  quantos: number;
  /** Quantos o grupo tem ao todo, para o título avisar quando está filtrado. */
  totalGrupo: number;
  aprovadas: number;
  aberto: boolean;
  alternar: () => void;
}) {
  const nome = grupo === GRUPO_ASSUNTOS ? "assunto" : "página";
  const plural = grupo === GRUPO_ASSUNTOS ? "assuntos" : "páginas";
  const sufixo =
    quantos < totalGrupo
      ? `${quantos} de ${totalGrupo} ${plural}`
      : `${quantos} ${quantos === 1 ? nome : plural}`;
  return (
    <h2>
      <button
        type="button"
        onClick={alternar}
        aria-expanded={aberto}
        aria-controls={`grupo-${grupo.replace(/\W+/g, "-")}`}
        className="wb-foco -mx-2 flex min-h-11 w-[calc(100%+1rem)] items-center gap-2 rounded-xl px-2 text-left text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--wb-tinta-2)] transition-colors hover:text-[var(--wb-roxo)]"
      >
        {/* O nome e a contagem quebram juntos dentro deste bloco; a seta fica sempre na
            primeira linha, à direita, onde o polegar a procura. */}
        <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
          {grupo}
          <span className="font-medium normal-case tracking-normal text-[var(--wb-tinta-3)]">
            {sufixo}
            {aprovadas > 0 && ` · ${aprovadas} aprovada${aprovadas > 1 ? "s" : ""}`}
          </span>
        </span>
        <svg
          viewBox="0 0 12 12"
          aria-hidden
          className={`size-3.5 shrink-0 transition-transform duration-300 ${aberto ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
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
  contar,
}: {
  titulo: string;
  nota: string;
  blocos: Bloco[];
  lado: "cliente" | "agencia";
  souAgencia: boolean;
  irPara: (id: string) => void;
  /** As contagens da página, na mesma conta que o cartão lá embaixo usa. */
  contar: (b: Bloco) => Contagem;
}) {
  const n = blocos.length;
  const minha = souAgencia === (lado === "agencia");
  const vazia = n === 0;
  /** A caixa cortava em 6 e dizia "e mais 1 abaixo", sem levar a lugar nenhum. Agora abre. */
  const [tudo, setTudo] = useState(false);
  const CORTE = 6;
  const visiveis = tudo ? blocos : blocos.slice(0, CORTE);

  return (
    <section
      // `self-start`: sem isto a coluna vazia esticava até a altura da coluna cheia e virava
      // um retângulo de 400px dizendo "nada por aqui".
      className={`wb-entra self-start overflow-hidden rounded-2xl ring-1 ${
        vazia
          ? "bg-white/60 ring-[var(--wb-linha)]"
          : minha
            ? "bg-[var(--wb-ambar-leve)] ring-[var(--wb-ambar-borda)]"
            : "bg-white ring-[var(--wb-linha)]"
      }`}
    >
      {/* Fila vazia é uma linha só. Com o mesmo corpo da fila cheia ela gastava 170px de um
          celular para dizer "nada aqui" — e essa é justamente a informação que menos importa. */}
      <div className={vazia ? "px-4 py-3" : "px-4 pb-1 pt-3.5"}>
        <h2 className="flex items-baseline gap-2 text-[15px] font-extrabold text-[var(--wb-tinta)]">
          <span
            aria-hidden
            className={`size-2.5 shrink-0 rounded-full ${
              vazia ? "bg-[var(--wb-linha)]" : lado === "cliente" ? "bg-[var(--wb-ambar)]" : "bg-[var(--wb-roxo-vivo)]"
            }`}
          />
          {titulo}
          {/* "7" sozinho aqui e "7 partes" na linha da Home eram dois "7" de coisas diferentes.
              Este conta PÁGINAS e passa a dizer isso. */}
          <span className="ml-auto whitespace-nowrap text-[13px] font-semibold text-[var(--wb-tinta-3)]">
            {vazia ? "nada por aqui" : `${n} ${n === 1 ? "página" : "páginas"}`}
          </span>
        </h2>
        {!vazia && <p className="mt-0.5 text-[13px] text-[var(--wb-tinta-3)]">{nota}</p>}
      </div>

      {!vazia && (
        <ul className="mt-1 px-1.5 pb-1.5">
          {visiveis.map((b) => {
            const c = contar(b);
            const pendentes = lado === "cliente" ? c.cliente : c.agencia;
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => irPara(b.id)}
                  className="wb-foco flex min-h-11 w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-white/70"
                >
                  <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[var(--wb-tinta)]">
                    {b.titulo}
                  </span>
                  {/*
                    O bug que ele apontou morava aqui. Esta linha dizia "7 partes" e o cartão da
                    mesma Home dizia "10 partes": uma contava o que estava pendente deste lado, a
                    outra contava as seções da página. Agora é uma fração — "7 de 10" —, que só
                    tem uma leitura possível e amarra os dois números na mesma conta.
                  */}
                  {c.total > 1 && (
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-white/80 px-2 py-0.5 text-[12px] font-bold tabular-nums text-[var(--wb-tinta-3)] ring-1 ring-[var(--wb-linha)]">
                      <span aria-hidden>
                        {pendentes} de {c.total}
                        <span className="hidden sm:inline"> partes</span>
                      </span>
                      <span className="sr-only">
                        {pendentes} de {c.total} partes esperando
                      </span>
                    </span>
                  )}
                  <svg viewBox="0 0 12 12" aria-hidden className="size-3.5 shrink-0 opacity-50">
                    <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </li>
            );
          })}
          {n > CORTE && (
            <li>
              <button
                type="button"
                onClick={() => setTudo(!tudo)}
                className="wb-foco flex min-h-11 w-full items-center gap-1.5 rounded-xl px-2.5 text-left text-[13px] font-bold text-[var(--wb-roxo)] transition-colors hover:bg-white/70"
              >
                {tudo
                  ? "ver menos"
                  : n - CORTE === 1
                    ? "ver mais 1 página"
                    : `ver as outras ${n - CORTE} páginas`}
                <svg
                  viewBox="0 0 12 12"
                  aria-hidden
                  className={`size-3.5 transition-transform duration-300 ${tudo ? "rotate-180" : ""}`}
                >
                  <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
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
            a.registrar(
              paginaId,
              secaoId,
              conversando || a.respondendoA ? "resposta" : "alteracao",
              a.rascunho,
              a.respondendoA,
            )
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

/**
 * Uma página do site, recolhida.
 *
 * **Por que fechar.** São 56 páginas. O cartão aberto mostra a pergunta em aberto, três botões
 * e o atalho para as partes — cerca de 400px no celular —, e vezes 56 isso é um documento de
 * vinte telas em que nada se acha. Fechado, cada página é uma linha de três informações: nome,
 * quantas partes tem e quantas já foram aprovadas, mais a última fala quando há conversa
 * parada. O que ele precisa para decidir *qual* abrir cabe na linha; o resto vem ao abrir.
 *
 * **Uma aberta de cada vez** (a decisão está em `aberta`, no painel): abrir a segunda fecha a
 * primeira, senão a lista volta a crescer sem fim debaixo do dedo.
 *
 * **Sem selo em pílula.** O estado deixou de ser uma etiqueta ao lado do título e virou a
 * própria linha de contagem — "10 partes · 7 esperando The Dark Film". Uma pílula escrita
 * "Esperando The Dark Film" ao lado de "10 partes" era duas informações desencontradas
 * disputando a mesma linha estreita; escrito por extenso, o número e o que ele significa ficam
 * grudados, que é justamente o que faltava.
 */
function CartaoPagina({
  b,
  i,
  situacao,
  contagem,
  aberto,
  alternar,
  partesAbertas,
  alternarPartes,
  aberta,
}: {
  b: Bloco;
  i: number;
  situacao: Situacao;
  contagem: Contagem;
  aberto: boolean;
  alternar: () => void;
  /** Segundo nível: a lista de seções dentro da página já aberta. */
  partesAbertas: boolean;
  alternarPartes: () => void;
  aberta?: { ev: Evento; parte: string };
}) {
  const a = useAcoes();
  const t = tom(situacao, a.souAgencia);
  const { total, aprovadas, cliente, agencia } = contagem;

  // O item "página inteira" só entra na lista quando tem conversa: nascer vazio confundia.
  const partes = [
    ...b.itens,
    { id: ITEM_PAGINA, titulo: "Sobre a página inteira" },
  ].filter((it) => it.id !== ITEM_PAGINA || a.eventosDe(b.id, ITEM_PAGINA).length > 0);

  /**
   * A linha de contagem, que é o conserto do "7 partes × 10 partes".
   *
   * Os dois números aparecem lado a lado e na mesma frase, então não há como confundir o total
   * da página com o que está pendente de um lado. O trecho do lado de quem está lendo é o único
   * em negrito: numa lista de 56 linhas, só o que exige ação de quem olha pode ter peso.
   */
  const pedacos: { texto: string; meu?: boolean }[] = [
    { texto: `${total} ${total === 1 ? "parte" : "partes"}` },
  ];
  if (aprovadas > 0) {
    pedacos.push({ texto: `${aprovadas} aprovada${aprovadas > 1 ? "s" : ""}` });
  }
  if (cliente > 0) {
    pedacos.push({ texto: `${cliente} esperando ${NOME_CLIENTE}`, meu: !a.souAgencia });
  }
  if (agencia > 0) {
    pedacos.push({ texto: `${agencia} esperando a WB`, meu: a.souAgencia });
  }
  if (pedacos.length === 1 && t === "silencio") pedacos.push({ texto: "ainda não olhada" });

  return (
    <li
      id={`bloco-${b.id}`}
      style={{ "--i": Math.min(i, 10), "--wb-cor-trilho": TRILHO[t] } as React.CSSProperties}
      className={`wb-entra wb-cartao wb-trilho wb-alvo overflow-hidden rounded-2xl border bg-white shadow-[0_8px_24px_-20px_rgba(53,5,69,0.55)] ${
        aberto ? "border-[var(--wb-lilas)]" : "border-[var(--wb-linha)]"
      } ${a.flash === `${b.id}/pagina` ? "wb-flash" : ""}`}
    >
      {/*
        O cabeçalho inteiro é o botão. Num celular, dentro de uma oficina, o alvo tem de ser a
        linha toda — mirar num chevron de 14px com a mão suja é o tipo de coisa que faz a pessoa
        desistir e voltar para o WhatsApp.
      */}
      <h3>
        <button
          type="button"
          onClick={alternar}
          aria-expanded={aberto}
          aria-controls={`corpo-${b.id}`}
          className="wb-foco flex w-full items-center gap-3 p-4 pl-5 text-left sm:p-5 sm:pl-6"
        >
          <span
            className={`mt-0.5 size-2.5 shrink-0 self-start rounded-full ${PONTO[t]}`}
            role="img"
            aria-label={rotulo(situacao, a.souAgencia)}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[17px] font-bold leading-tight text-[var(--wb-tinta)]">
              {b.titulo}
            </span>
            <span className="mt-1 block text-[13px] leading-snug text-[var(--wb-tinta-3)]">
              {/* `whitespace-nowrap` no pedaço, separador fora dele: assim a linha quebra ENTRE
                  as contagens e nunca no meio de uma ("4 esperando The Dark / Film" fazia o
                  número perder o dono). O separador precisa ficar de fora, senão não sobra
                  nenhum ponto de quebra e a linha estoura para cima da seta. */}
              {pedacos.map((p, k) => (
                <span key={p.texto}>
                  {k > 0 && " · "}
                  <span
                    className={`whitespace-nowrap ${p.meu ? "font-bold text-[var(--wb-ambar-tinta)]" : ""}`}
                  >
                    {p.texto}
                  </span>
                </span>
              ))}
            </span>
            {/*
              Fechado, o cartão ainda mostra de que se trata a conversa parada. Sem isto ele
              teria de abrir cada uma das páginas em âmbar para descobrir qual era o assunto.
            */}
            {aberta && !aberto && (
              <span className="mt-1 block truncate text-[12.5px] text-[var(--wb-tinta-2)]">
                {apelido(aberta.ev.autor)}: {aberta.ev.texto}
              </span>
            )}
          </span>
          <svg
            viewBox="0 0 12 12"
            aria-hidden
            className={`size-4 shrink-0 text-[var(--wb-tinta-3)] transition-transform duration-300 ${
              aberto ? "rotate-180" : ""
            }`}
          >
            <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>

      <Sanfona aberta={aberto} id={`corpo-${b.id}`}>
        <div className="px-4 pb-4 pl-5 sm:px-5 sm:pb-5 sm:pl-6">
          {aberta && (
            <PerguntaAberta
              ev={aberta.ev}
              parte={aberta.parte}
              praVoce={t === "voce"}
              abrir={() => {
                if (!partesAbertas) alternarPartes();
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

          {partes.length > 1 && (
            <button
              type="button"
              onClick={alternarPartes}
              aria-expanded={partesAbertas}
              aria-controls={`partes-${b.id}`}
              className="wb-foco -ml-2 mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-[14px] font-semibold text-[var(--wb-tinta-3)] transition-colors hover:text-[var(--wb-roxo)]"
            >
              {partesAbertas
                ? "esconder as partes"
                : `ver as ${partes.length} partes, uma por uma`}
              <svg
                viewBox="0 0 12 12"
                aria-hidden
                className={`size-3.5 transition-transform duration-300 ${partesAbertas ? "rotate-180" : ""}`}
              >
                <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        <Sanfona aberta={partesAbertas} id={`partes-${b.id}`}>
          <ul className="divide-y divide-[var(--wb-linha)] border-t border-[var(--wb-linha)] bg-[var(--wb-fundo)]">
            {partes.map((it) => (
              <LinhaParte key={it.id} blocoId={b.id} item={it} />
            ))}
          </ul>
        </Sanfona>
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
      {/* A chave da escrita é a mesma que `Acoes` usa para esta parte: assim o campo abre logo
          abaixo, no lugar de sempre, só que já amarrado à fala escolhida. */}
      <Conversa
        eventos={eventos}
        souAgencia={a.souAgencia}
        responder={(ev) => a.abrirEscrita(`${blocoId}/${item.id}`, ev.id)}
        aprovar={(ev) =>
          a.registrar(blocoId, item.id, a.souAgencia ? "confirmado" : "aprovado", undefined, ev.id)
        }
      />
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
          <Conversa
        eventos={eventos}
        souAgencia={a.souAgencia}
        responder={(ev) => a.abrirEscrita(chave, ev.id)}
        aprovar={(ev) =>
          a.registrar(paginaId, secaoId, a.souAgencia ? "confirmado" : "aprovado", undefined, ev.id)
        }
      />
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
