import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { ArrowIcon } from "../icons";
import { ShieldCheckIcon } from "../icons/home";

// Linhas citadas no texto original da página 3M.
const linhas = ["Crystalline", "CS Premium", "FX Pro", "EX", "Black Chrome"];

export function Seal3M() {
  return (
    <section className="atmo atmo-red relative overflow-hidden border-y border-line bg-bg-2 grain">
      {/* marca-d'água: sai pela direita, corta o grid de propósito */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[46vw] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.06)] md:-right-12 md:text-[28vw]"
      >
        3M
      </div>

      <div className="container-x relative grid gap-10 py-24 md:grid-cols-[auto_1fr] md:items-center md:gap-14 md:py-32 lg:grid-cols-[auto_1fr_auto]">
        <Reveal>
          <div className="relative mx-auto size-32 md:size-40">
            <span aria-hidden className="seal-ring" />
            <div className="grid size-full place-items-center rounded-full border-2 border-red bg-bg font-display text-5xl font-bold text-fg shadow-[0_0_60px_-10px_rgba(209,20,31,0.45)] md:text-6xl">
              3M
            </div>
            <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-line-strong bg-bg px-3 py-1 font-display text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-fg-2">
              <ShieldCheckIcon className="size-3.5 text-red-2" />
              Credenciada
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow mb-4">Credenciamento</p>
          <h2 className="display text-4xl md:text-6xl">
            Aplicadora credenciada 3M<span className="text-red-2">.</span>
          </h2>
          <p className="mt-5 max-w-xl text-fg-2">
            Menos calor, mais proteção. Películas 3M das linhas Crystalline, CS Premium, FX Pro,
            EX e Black Chrome: até 99% dos raios UV bloqueados, sem interferência em GPS e celular.
          </p>
          <RevealGroup stagger={0.06} className="mt-6 flex flex-wrap gap-2">
            {linhas.map((l) => (
              <RevealItem
                key={l}
                className="rounded-full border border-line-strong px-3.5 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-fg-2"
              >
                {l}
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>

        <Reveal delay={0.2} className="md:col-span-2 lg:col-span-1">
          <Link
            href="/3m"
            className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-line-strong px-6 py-4 font-display text-base font-semibold uppercase tracking-[0.14em] transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-red hover:bg-red hover:text-white"
          >
            Sobre o credenciamento
            <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
