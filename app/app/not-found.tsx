import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden grain">
      <div aria-hidden className="nf-atmo" />
      <div aria-hidden className="hero-rules" />

      {/* 404 fantasma: só contorno, sangra à direita como elemento gráfico */}
      <p
        aria-hidden
        className="num-ghost pointer-events-none absolute -right-6 top-1/2 -z-10 -translate-y-1/2 select-none md:-right-10"
      >
        404
      </p>

      <div className="container-x flex min-h-[78vh] flex-col justify-center py-32">
        <div className="relative max-w-2xl border-l border-line pl-5 md:pl-7">
          <span aria-hidden className="absolute left-0 top-0 h-16 w-px bg-red" />
          <p className="eyebrow mb-4">Erro 404</p>
          <h1 className="display text-[clamp(3rem,10vw,7rem)] [text-wrap:balance]">
            Página não <span className="text-red-2">encontrada.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-fg-2">
            O endereço pode ter mudado com o site novo. Volte para o início ou veja o catálogo.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-red px-6 py-3 font-display font-semibold uppercase tracking-[0.14em] text-white transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-red-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Início <ArrowIcon className="size-4" />
            </Link>
            <Link
              href="/som-e-acessorios"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-display font-semibold uppercase tracking-[0.14em] text-fg-2 transition-[border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-red hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Som e acessórios
            </Link>
          </div>
        </div>
      </div>
      <span aria-hidden className="hero-baseline" />
    </section>
  );
}
