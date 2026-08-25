import Link from "next/link";
import { Reveal } from "../Reveal";
import { ArrowIcon } from "../icons";

export function Seal3M() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-bg-2">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 select-none font-display text-[40vw] font-bold leading-none text-fg/[0.035] md:text-[26vw]"
      >
        3M
      </div>
      <div className="container-x relative grid gap-10 py-24 md:grid-cols-[auto_1fr_auto] md:items-center md:py-32">
        <Reveal>
          <div className="grid size-28 place-items-center rounded-full border-2 border-red bg-bg font-display text-4xl font-bold text-fg md:size-36 md:text-5xl">
            3M
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
        </Reveal>
        <Reveal delay={0.2}>
          <Link
            href="/3m"
            className="group inline-flex items-center gap-3 rounded-full border border-line-strong px-6 py-4 font-display text-base font-semibold uppercase tracking-[0.14em] transition-colors hover:border-red hover:bg-red hover:text-white"
          >
            Sobre o credenciamento
            <ArrowIcon className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
