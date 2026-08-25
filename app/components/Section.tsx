import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Bloco de conteúdo: título à esquerda, corpo à direita (empilha no mobile). */
export function Section({
  eyebrow,
  title,
  children,
  aside,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="container-x border-t border-line py-16 md:py-24">
      <div className="grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <Reveal>
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="display text-3xl md:text-5xl">{title}</h2>
          {aside && <div className="mt-8">{aside}</div>}
        </Reveal>
        <Reveal delay={0.1} className="prose-dark">
          {children}
        </Reveal>
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

/** Número grande com legenda (ex.: "99%", "raios UV bloqueados"). */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-red pl-5">
      <p className="display text-5xl text-fg md:text-6xl">{value}</p>
      <p className="mt-2 text-sm text-fg-2">{label}</p>
    </div>
  );
}
