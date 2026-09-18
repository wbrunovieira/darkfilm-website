"use client";

/**
 * A conversa de um item, e o campo para escrever nela.
 *
 * O problema apontado pelo cliente era de leitura, não de dados: o histórico era uma lista
 * corrida em que autor, verbo, data e texto se misturavam numa linha só, e não dava para
 * varrer quem tinha dito o quê. Duas decisões resolvem isso:
 *
 * 1. **Duas vozes, duas cores fixas** — âmbar é sempre The Dark Film, roxo é sempre a WB —
 *    e alinhamento pelo lado de quem está lendo (as suas falas à direita). É exatamente a
 *    convenção do WhatsApp, que é de onde essas conversas estão saindo.
 * 2. **Nem todo evento é uma fala.** Aprovar, desfazer e agradecer não têm texto: virar balão
 *    para eles enchia a conversa de balões vazios. Viram marco de linha do tempo, centrado e
 *    fino, como o separador de data de um aplicativo de mensagem.
 */

import { useEffect, useRef } from "react";
import { LADO, type Evento } from "@/lib/revisao";
import { Aviso, Botao, apelido, dataCompleta, haQuanto } from "./ui";

/** Ações que não carregam fala: são fatos do processo, não coisas que alguém disse. */
const MARCO = new Set(["criado", "aprovado", "desfeito", "confirmado"]);

/** As duas que aprovam. Quando vêm amarradas a uma fala, viram selo nela. */
const VISTO = new Set(["aprovado", "confirmado"]);

const FRASE: Record<string, string> = {
  criado: "abriu este assunto",
  aprovado: "aprovou",
  desfeito: "voltou atrás na aprovação",
  confirmado: "agradeceu e fechou",
};

/** Etiqueta curta dentro do balão, só quando a ação não é óbvia pelo texto. */
const ETIQUETA: Record<string, string> = {
  alteracao: "pedido",
  ajustado: "arrumado",
};

/**
 * A conversa, com as respostas penduradas no pedido que responderam.
 *
 * Era uma pilha corrida: três pedidos dele seguidos e duas respostas nossas no fim, sem dizer
 * qual respondia qual. Ele pediu para ver cada pedido já com a resposta junto. Agora a resposta
 * aparece encostada embaixo do pedido, recuada e com um fio ligando os dois.
 *
 * Fala sem vínculo — tudo que foi registrado antes disto existir — continua na linha do tempo,
 * na ordem de sempre. Nada some.
 */
export function Conversa({
  eventos,
  souAgencia,
  responder,
  aprovar,
}: {
  eventos: Evento[];
  souAgencia: boolean;
  /** Abre a escrita já amarrada a esta fala. Ausente = painel em modo leitura. */
  responder?: (e: Evento) => void;
  /** Aprova uma fala do outro lado. Ausente = painel em modo leitura. */
  aprovar?: (e: Evento) => void;
}) {
  if (!eventos.length) return null;

  const respostas = new Map<string, Evento[]>();
  /** Aprovação amarrada a uma fala vira selo NAQUELA fala, não uma linha solta na conversa. */
  const selo = new Map<string, Evento>();
  for (const e of eventos) {
    if (!e.respondeA) continue;
    if (VISTO.has(e.acao)) {
      selo.set(e.respondeA, e);
      continue;
    }
    respostas.set(e.respondeA, [...(respostas.get(e.respondeA) ?? []), e]);
  }
  // Uma resposta pendurada não se repete na linha principal.
  const raiz = eventos.filter(
    (e) => !selo.has(e.respondeA ?? "") && (!e.respondeA || !eventos.some((x) => x.id === e.respondeA)),
  ).filter((e) => !(e.respondeA && VISTO.has(e.acao)));

  /** De que lado a fala se alinha: a de quem está lendo vai para a direita. */
  const meuLado = (e: Evento) => (LADO[e.autor] === "agencia") === souAgencia;

  /**
   * A resposta herda o LADO do pedido, mesmo sendo de outra voz.
   *
   * Na primeira versão ela ficava no lado dela — pedido à direita, resposta à esquerda — e o fio
   * que devia ligar as duas atravessava a largura toda, virando um risco solto na margem. Aqui a
   * resposta entra encostada, recuada pelo mesmo lado do pedido, com um fio curto. A cor continua
   * dizendo quem falou: âmbar The Dark Film, roxo WB.
   */
  const nó = (e: Evento, ladoPai?: boolean) =>
    MARCO.has(e.acao) || !e.texto ? (
      <Marco key={e.id} e={e} />
    ) : (
      <Balao
        key={e.id}
        e={e}
        alinhaDireita={ladoPai ?? meuLado(e)}
        minha={meuLado(e)}
        visto={selo.get(e.id)}
        responder={responder}
        aprovar={aprovar}
      >
        {(respostas.get(e.id) ?? []).map((r) => nó(r, ladoPai ?? meuLado(e)))}
      </Balao>
    );

  return <ol className="mt-3 flex flex-col gap-2.5">{raiz.map((e) => nó(e))}</ol>;
}

function Marco({ e }: { e: Evento }) {
  return (
    <li className="flex items-center gap-2.5 py-0.5">
      <span className="h-px flex-1 bg-[var(--wb-linha)]" aria-hidden />
      <span className="text-[12px] font-medium text-[var(--wb-tinta-3)]" title={dataCompleta(e.em)} suppressHydrationWarning>
        {apelido(e.autor)} {FRASE[e.acao] ?? e.acao} · {haQuanto(e.em)}
      </span>
      <span className="h-px flex-1 bg-[var(--wb-linha)]" aria-hidden />
    </li>
  );
}

function Balao({
  e,
  alinhaDireita,
  minha,
  visto,
  responder,
  aprovar,
  children,
}: {
  e: Evento;
  /** Lado do balão. Numa resposta é o lado do PEDIDO, não o do autor. */
  alinhaDireita: boolean;
  /** Se esta fala é de quem está lendo. Só o outro lado se aprova. */
  minha: boolean;
  /** Aprovação amarrada a esta fala, quando já houve uma. */
  visto?: Evento;
  responder?: (e: Evento) => void;
  aprovar?: (e: Evento) => void;
  children?: React.ReactNode;
}) {
  const daAgencia = LADO[e.autor] === "agencia";
  const temRespostas = !!children && (Array.isArray(children) ? children.length > 0 : true);
  return (
    <li>
      <div className={`flex ${alinhaDireita ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[min(46ch,92%)] rounded-2xl px-3.5 py-2.5 ring-1 ${
          daAgencia
            ? "bg-[var(--wb-roxo-leve)] ring-[var(--wb-roxo-borda)]"
            : "bg-[var(--wb-ambar-leve)] ring-[#f0d5a4]"
        } ${alinhaDireita ? "rounded-br-md" : "rounded-bl-md"}`}
      >
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[13px] font-bold text-[var(--wb-tinta)]">{apelido(e.autor)}</span>
          {ETIQUETA[e.acao] && (
            <span className="text-[12px] font-medium text-[var(--wb-tinta-3)]">
              {ETIQUETA[e.acao]}
            </span>
          )}
          <span className="text-[12px] text-[var(--wb-tinta-3)]" title={dataCompleta(e.em)} suppressHydrationWarning>
            {haQuanto(e.em)}
          </span>
        </p>
        <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-[var(--wb-tinta)]">
          {e.texto}
        </p>
        {e.origem && <Origem origem={e.origem} />}
        {/* Aprovar a resposta, e não só a seção inteira: é o que ele pediu em 18/09/2026. Só
            aparece na fala do OUTRO lado — ninguém aprova a própria — e some quando já houve
            aprovação, dando lugar ao selo. */}
        {visto ? (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--wb-verde-leve)] px-2 py-0.5 text-[12px] font-semibold text-[var(--wb-verde-tinta)]">
            <svg viewBox="0 0 12 12" aria-hidden className="size-3">
              <path d="M2.5 6.3l2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {apelido(visto.autor)} aprovou
          </p>
        ) : (
          (responder || (aprovar && !minha)) && (
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              {aprovar && !minha && (
                <button
                  type="button"
                  onClick={() => aprovar(e)}
                  className="wb-foco rounded-lg text-[12.5px] font-bold text-[var(--wb-verde-tinta)] underline underline-offset-2"
                >
                  está certo
                </button>
              )}
              {responder && (
                <button
                  type="button"
                  onClick={() => responder(e)}
                  className="wb-foco rounded-lg text-[12.5px] font-semibold text-[var(--wb-roxo)] underline underline-offset-2 transition-colors hover:text-[var(--wb-roxo-vivo)]"
                >
                  responder a esta
                </button>
              )}
            </p>
          )
        )}
        </div>
      </div>
      {/* Trilho contínuo ao lado das respostas, como citação. Antes era um fio curto em L, e ele
          não encostava em nada: o pedido e a resposta ficam em alturas e larguras diferentes, e
          o cotovelo sobrava solto entre os dois. O trilho corre ao lado de todas as respostas
          daquele pedido, do começo ao fim — não tem como ler errado a quem elas pertencem. */}
      {temRespostas && (
        <ol
          className={`mt-1.5 flex flex-col gap-1.5 border-[var(--wb-lilas)] ${
            alinhaDireita ? "mr-2 border-r-2 pr-3 sm:mr-3" : "ml-2 border-l-2 pl-3 sm:ml-3"
          }`}
        >
          {children}
        </ol>
      )}
    </li>
  );
}

/**
 * Marca de procedência.
 *
 * Estes dois casos não passaram pelo painel: um é pedido que o cliente mandou no WhatsApp
 * antes de a ferramenta existir e foi transcrito, o outro é resposta que a WB registrou por
 * ele. A borda tracejada existe para isso — sinaliza "copiado para cá", e não deixa a fala se
 * confundir com o que foi realmente digitado e carimbado com IP aqui dentro.
 */
function Origem({ origem }: { origem: "whatsapp" | "interno" }) {
  return (
    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-[var(--wb-lilas)] bg-white/70 px-2 py-0.5 text-[11.5px] font-medium text-[var(--wb-tinta-2)]">
      {origem === "whatsapp" ? (
        <>
          <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 text-[#128c7e]">
            <path
              d="M8 1.5a6.5 6.5 0 0 0-5.6 9.8L1.5 14.5l3.3-.85A6.5 6.5 0 1 0 8 1.5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          copiado do WhatsApp
        </>
      ) : (
        <>anotado aqui pela WB</>
      )}
    </span>
  );
}

/**
 * Campo de escrita.
 *
 * Três correções de celular moram aqui:
 * - `text-[16px]` no textarea. Abaixo disso o Safari do iPhone dá zoom ao focar e a pessoa
 *   perde o cartão de vista.
 * - ao focar, o bloco inteiro rola para dentro da tela depois que o teclado sobe — era o
 *   motivo de o botão Enviar nascer escondido atrás do teclado.
 * - o erro aparece aqui, junto do botão, e não no topo do documento.
 */
export function Campo({
  valor,
  onChange,
  onEnviar,
  onCancelar,
  ocupado,
  erro,
  dica,
  exemplo,
  assinatura,
}: {
  valor: string;
  onChange: (v: string) => void;
  onEnviar: () => void;
  onCancelar: () => void;
  ocupado: boolean;
  erro?: string | null;
  dica: string;
  exemplo?: string;
  assinatura: string;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    area.current?.focus({ preventScroll: true });
  }, []);

  // O teclado do celular só termina de subir alguns quadros depois do foco; rolar antes disso
  // não adianta. `visualViewport` avisa quando a área visível encolheu — é o momento certo.
  const aoFocar = () => {
    const rolar = () => caixa.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    const vv = window.visualViewport;
    if (!vv) return void setTimeout(rolar, 250);
    const umaVez = () => {
      vv.removeEventListener("resize", umaVez);
      rolar();
    };
    vv.addEventListener("resize", umaVez);
    setTimeout(() => {
      vv.removeEventListener("resize", umaVez);
      rolar();
    }, 500);
  };

  return (
    <div
      ref={caixa}
      className="wb-alvo mt-3 rounded-2xl border border-[var(--wb-linha)] bg-[var(--wb-fundo)] p-3.5"
    >
      <label className="block text-[14px] font-semibold text-[var(--wb-tinta)]">{dica}</label>
      <textarea
        ref={area}
        value={valor}
        onChange={(ev) => onChange(ev.target.value)}
        onFocus={aoFocar}
        rows={3}
        className="wb-foco mt-2 w-full resize-y rounded-xl border border-[var(--wb-lilas)] bg-white px-3 py-2.5 text-[16px] leading-relaxed text-[var(--wb-tinta)] placeholder:text-[var(--wb-tinta-3)] focus:border-[var(--wb-roxo-vivo)] focus:outline-none"
        placeholder={exemplo ?? "Escreva com suas palavras. Ex.: trocar a foto, esse texto está desatualizado, a foto certa está no Drive…"}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Botao peso="destaque" onClick={onEnviar} disabled={!valor.trim()} ocupado={ocupado}>
          {ocupado ? "Enviando…" : "Enviar"}
        </Botao>
        <Botao peso="discreto" onClick={onCancelar}>
          Cancelar
        </Botao>
        <span className="ml-auto text-[12.5px] text-[var(--wb-tinta-3)]">
          assinando como <strong className="font-semibold">{assinatura}</strong>
        </span>
      </div>
      {erro && <Aviso>{erro}</Aviso>}
    </div>
  );
}
