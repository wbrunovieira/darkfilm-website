import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowIcon } from "../icons";
import { CountUp } from "../CountUp";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { StarIcon } from "../icons/home";

export function Clients() {
  const rating = site.google.rating.toLocaleString("pt-BR");
  return (
    <section className="atmo atmo-soft overflow-hidden py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mb-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Quem confia</p>
            <h2 className="display text-4xl md:text-6xl">
              Nossa qualidade é atestada pelo serviço prestado aos clientes.
            </h2>
            {/* Única porta para A Empresa no corpo do site: a página que carrega os anos de
                mercado e esses mesmos clientes não tinha nenhum link entrando. */}
            <Link
              href="/a-empresa"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-fg-2 transition-colors hover:text-fg"
            >
              Conheça a empresa
              <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <a
            href={site.google.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group card-lift relative shrink-0 overflow-hidden rounded-lg border border-line bg-bg-2 p-5 md:w-72"
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
            <p className="display flex items-baseline text-6xl">
              {rating}
              <span className="ml-1 text-2xl text-fg-3">/5</span>
            </p>
            <p className="mt-2 flex items-center gap-0.5 text-gold" aria-label={`${rating} de 5 estrelas`}>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className={`size-4 ${i < Math.round(site.google.rating) ? "" : "opacity-30"}`} />
              ))}
            </p>
            <p className="mt-2 text-sm text-fg-2">
              Nota no Google, com{" "}
              <strong className="text-fg">
                <CountUp value={String(site.google.reviews)} /> avaliações
              </strong>{" "}
              de clientes.
            </p>
            <p className="mt-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-fg-3 transition-colors group-hover:text-red-2">
              Ler avaliações →
            </p>
          </a>
        </Reveal>

        {/* Grade de clientes: células com marca de canto, índice pequeno e nome grande. */}
        <RevealGroup stagger={0.1} className="grid grid-cols-2 border-t border-l border-line md:grid-cols-4">
          {site.clients.map((c, i) => (
            <RevealItem
              key={c}
              className="cell-mark group relative flex min-h-40 flex-col justify-between border-b border-r border-line p-5 transition-colors duration-300 hover:bg-bg-2 md:min-h-52 md:p-6"
            >
              <span className="font-display text-xs font-medium tracking-[0.2em] text-fg-3">0{i + 1}</span>
              <span className="font-display text-2xl font-semibold uppercase leading-[0.95] text-fg-2 transition-colors duration-300 group-hover:text-fg md:text-3xl">
                {c}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-4 text-xs text-fg-3">Clientes atendidos, conforme a página “A Empresa”.</p>
      </div>
    </section>
  );
}
