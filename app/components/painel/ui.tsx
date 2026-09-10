"use client";

/**
 * Peças repetidas do painel: selos de estado, cabeçalho de seção, campo de formulário e bloco
 * recolhível. Ficam num arquivo só para as telas manterem o mesmo desenho sem copiar classe.
 */

import { useState } from "react";

export function Selo({ tom, children }: { tom: "ok" | "espera" | "ruim" | "neutro"; children: React.ReactNode }) {
  const cores = {
    ok: "bg-emerald-500/12 text-emerald-300 ring-emerald-400/25",
    espera: "bg-amber-500/12 text-amber-300 ring-amber-400/25",
    ruim: "bg-red/15 text-red-2 ring-red/30",
    neutro: "bg-white/5 text-fg-3 ring-white/10",
  }[tom];
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ring-1 ring-inset ${cores}`}>
      {children}
    </span>
  );
}

export function TituloSecao({ titulo, apoio, acao }: { titulo: string; apoio?: string; acao?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="display text-2xl md:text-3xl">{titulo}</h2>
        {apoio && <p className="mt-1 text-sm text-fg-3">{apoio}</p>}
      </div>
      {acao}
    </div>
  );
}

export function Painel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-bg-2 ${className}`}>{children}</div>;
}

export function Campo({
  rotulo, valor, apoio, obrigatorio, largura = "", tipo = "texto", opcoes,
}: {
  rotulo: string; valor: string; apoio?: string; obrigatorio?: boolean;
  largura?: string; tipo?: "texto" | "area" | "select"; opcoes?: string[];
}) {
  const base = "w-full rounded-lg border border-line bg-bg-3 px-3 py-2.5 text-sm text-fg outline-none transition-colors focus:border-red/60";
  return (
    <label className={`block ${largura}`}>
      <span className="mb-1.5 flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-fg-3">
        {rotulo}
        {obrigatorio && <span className="text-red-2" title="Campo obrigatório">*</span>}
      </span>
      {tipo === "area" ? (
        <textarea rows={3} defaultValue={valor} className={base} />
      ) : tipo === "select" ? (
        <select defaultValue={valor} className={base}>
          {(opcoes ?? [valor]).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input defaultValue={valor} className={base} />
      )}
      {apoio && <span className="mt-1 block text-[0.7rem] text-fg-3">{apoio}</span>}
    </label>
  );
}

export function BlocoRecolhivel({
  titulo, apoio, children, abertoInicial = false,
}: {
  titulo: string; apoio?: string; children: React.ReactNode; abertoInicial?: boolean;
}) {
  const [aberto, setAberto] = useState(abertoInicial);
  return (
    <section className="rounded-xl border border-line bg-bg-2">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span>
          <span className="font-display text-sm font-semibold uppercase tracking-[0.12em]">{titulo}</span>
          {apoio && <span className="mt-0.5 block text-xs font-normal normal-case tracking-normal text-fg-3">{apoio}</span>}
        </span>
        <svg viewBox="0 0 24 24" className={`size-5 shrink-0 text-fg-3 transition-transform ${aberto ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {aberto && <div className="border-t border-line px-5 py-5">{children}</div>}
    </section>
  );
}

export function Botao({
  children, tom = "normal", onClick, tipo = "button",
}: {
  children: React.ReactNode; tom?: "normal" | "forte" | "leve"; onClick?: () => void; tipo?: "button" | "submit";
}) {
  const cores = {
    forte: "bg-red text-white hover:brightness-110",
    normal: "border border-line-strong text-fg hover:border-red hover:text-red-2",
    leve: "text-fg-3 hover:text-fg",
  }[tom];
  return (
    <button type={tipo} onClick={onClick} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 font-display text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${cores}`}>
      {children}
    </button>
  );
}
