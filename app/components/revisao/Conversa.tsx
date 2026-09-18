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
}: {
  eventos: Evento[];
  souAgencia: boolean;
  /** Abre a escrita já amarrada a esta fala. Ausente = painel em modo leitura. */
  responder?: (e: Evento) => void;
}) {
  if (!eventos.length) return null;

  const respostas = new Map<string, Evento[]>();
  for (const e of eventos) {
    if (!e.respondeA) continue;
    respostas.set(e.respondeA, [...(respostas.get(e.respondeA) ?? []), e]);
  }
  // Uma resposta pendurada não se repete na linha principal.
  const raiz = eventos.filter((e) => !e.respondeA || !eventos.some((x) => x.id === e.respondeA));

  const nó = (e: Evento, aninhada = false) =>
    MARCO.has(e.acao) || !e.texto ? (
      <Marco key={e.id} e={e} />
    ) : (
      <Balao key={e.id} e={e} souAgencia={souAgencia} responder={responder} aninhada={aninhada}>
        {(respostas.get(e.id) ?? []).map((r) => nó(r, true))}
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
  souAgencia,
  responder,
  aninhada,
  children,
}: {
  e: Evento;
  souAgencia: boolean;
  responder?: (e: Evento) => void;
  /** Resposta pendurada num pedido: entra recuada, com o fio ligando. */
  aninhada?: boolean;
  children?: React.ReactNode;
}) {
  const daAgencia = LADO[e.autor] === "agencia";
  // "Minha" fala é a de quem está com o painel aberto. Alinhar à direita é a leitura que a
  // pessoa já tem no celular; a cor continua sendo do LADO, não de quem está lendo.
  const minha = daAgencia === souAgencia;
  const temRespostas = !!children && (Array.isArray(children) ? children.length > 0 : true);
  return (
    <li className={aninhada ? "relative pl-5 sm:pl-7" : undefined}>
      {aninhada && (
        <span
          aria-hidden
          className="absolute left-1.5 top-0 h-5 w-3.5 rounded-bl-lg border-b border-l border-[var(--wb-lilas)] sm:left-2.5"
        />
      )}
      <div className={`flex ${minha ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[min(46ch,92%)] rounded-2xl px-3.5 py-2.5 ring-1 ${
          daAgencia
            ? "bg-[var(--wb-roxo-leve)] ring-[var(--wb-roxo-borda)]"
            : "bg-[var(--wb-ambar-leve)] ring-[#f0d5a4]"
        } ${minha ? "rounded-br-md" : "rounded-bl-md"}`}
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
        {responder && (
          <button
            type="button"
            onClick={() => responder(e)}
            className="wb-foco mt-2 -ml-1 block rounded-lg px-1 text-[12.5px] font-semibold text-[var(--wb-roxo)] underline underline-offset-2 transition-colors hover:text-[var(--wb-roxo-vivo)]"
          >
            responder a esta
          </button>
        )}
        </div>
      </div>
      {temRespostas && <ol className="mt-2.5 flex flex-col gap-2.5">{children}</ol>}
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
