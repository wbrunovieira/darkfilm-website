import type { ReactNode } from "react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { CountUp } from "./CountUp";

type Tone = "plain" | "atmo" | "atmo-cool";

const toneClass: Record<Tone, string> = {
  plain: "",
  atmo: "pel-atmo",
  "atmo-cool": "pel-atmo pel-atmo--cool",
};

/**
 * Bloco de conteúdo: título à esquerda (fica preso ao rolar no desktop), corpo à direita.
 * `index` desenha um número grande vazado atrás do título; `tone` dá fundo com atmosfera.
 */
export function Section({
  eyebrow,
  title,
  children,
  aside,
  id,
  index,
  tone = "plain",
  sticky = true,
  after,
}: {
  eyebrow?: string;
  title: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  id?: string;
  index?: string;
  tone?: Tone;
  sticky?: boolean;
  /** Conteúdo em largura total, abaixo das duas colunas (grades, comparativos). */
  after?: ReactNode;
}) {
  return (
    <section id={id} className={`border-t border-line ${toneClass[tone]}`}>
      <div className="container-x py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <Reveal className={sticky ? "pel-sticky" : undefined}>
            <div className="relative">
              {index && (
                <span aria-hidden className="pel-num pointer-events-none absolute -left-2 -top-10 text-[7rem] md:-top-14 md:text-[9rem]">
                  {index}
                </span>
              )}
              {eyebrow && <p className="eyebrow relative mb-3">{eyebrow}</p>}
              <h2 className="display relative text-3xl md:text-5xl">{title}</h2>
            </div>
            {aside && <div className="mt-8">{aside}</div>}
          </Reveal>
          <Reveal delay={0.1} className="prose-dark">
            {children}
          </Reveal>
        </div>
        {after && <div className="mt-12 md:mt-16">{after}</div>}
      </div>
    </section>
  );
}

/** Lista de benefícios com marcador vermelho. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="not-prose mt-6 grid gap-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-4 text-fg-2">
          <span className="mt-2.5 block size-1.5 shrink-0 bg-red" aria-hidden />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** Lista com ícone por item (benefício, spec). Título opcional em caixa alta. */
export function IconList({
  items,
  columns = 1,
}: {
  items: { icon: ReactNode; title?: ReactNode; text: ReactNode }[];
  columns?: 1 | 2;
}) {
  return (
    <RevealGroup className={`not-prose mt-6 grid gap-x-8 gap-y-5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((it, i) => (
        <RevealItem key={i} className="flex gap-4">
          <span className="pel-icon pel-icon--sm mt-0.5">{it.icon}</span>
          <span className="min-w-0 text-fg-2">
            {it.title && (
              <span className="mb-1 block font-display text-base font-semibold uppercase leading-tight text-fg">
                {it.title}
              </span>
            )}
            {it.text}
          </span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/** Grade de tiles (ícone + título + texto) com stagger. */
export function Tiles({
  items,
  columns = 3,
}: {
  items: { icon: ReactNode; title: ReactNode; text?: ReactNode }[];
  columns?: 2 | 3 | 4 | 5;
}) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 lg:grid-cols-5",
  }[columns];
  return (
    <RevealGroup className={`not-prose grid gap-3 ${cols}`} stagger={0.06}>
      {items.map((it, i) => (
        <RevealItem key={i} className="pel-tile">
          <span className="pel-icon">{it.icon}</span>
          <div>
            <p className="font-display text-xl font-semibold uppercase leading-none">{it.title}</p>
            {it.text && <p className="mt-2 text-sm leading-relaxed text-fg-2">{it.text}</p>}
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/** Número grande com legenda (ex.: "99%", "raios UV bloqueados"). */
export function Stat({
  value,
  label,
  icon,
  size = "md",
}: {
  value: string;
  label: string;
  icon?: ReactNode;
  size?: "md" | "lg";
}) {
  return (
    <div className="border-l-2 border-red pl-5">
      {icon && <span className="pel-icon pel-icon--sm pel-icon--accent mb-4">{icon}</span>}
      <p className={`display text-fg ${size === "lg" ? "text-6xl md:text-8xl" : "text-5xl md:text-6xl"}`}>
        <CountUp value={value} />
      </p>
      <p className="mt-2 max-w-[18rem] text-sm text-fg-2">{label}</p>
    </div>
  );
}

/** Destaque em caixa (nota legal, aviso). */
export function Callout({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <Reveal className="flex gap-4 border border-line-strong bg-bg-2/60 p-5 text-sm leading-relaxed text-fg-2">
      {icon && <span className="pel-icon pel-icon--sm pel-icon--accent">{icon}</span>}
      <div>{children}</div>
    </Reveal>
  );
}
