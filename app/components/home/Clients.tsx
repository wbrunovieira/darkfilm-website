import { site } from "@/lib/site";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";

export function Clients() {
  return (
    <section className="container-x py-24 md:py-32">
      <Reveal className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Quem confia</p>
          <h2 className="display text-4xl md:text-6xl">
            Nossa qualidade é atestada pelo serviço prestado aos clientes.
          </h2>
        </div>
        <a
          href={site.google.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group shrink-0 rounded-lg border border-line bg-bg-2 p-5 transition-colors hover:border-line-strong md:w-64"
        >
          <p className="display text-5xl">
            {site.google.rating.toLocaleString("pt-BR")}
            <span className="text-2xl text-fg-3">/5</span>
          </p>
          <p className="mt-1 text-sm text-fg-2">
            Nota no Google, com <strong className="text-fg">{site.google.reviews} avaliações</strong> de clientes.
          </p>
          <p className="mt-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-fg-3 group-hover:text-red-2">
            Ler avaliações →
          </p>
        </a>
      </Reveal>
      <RevealGroup className="grid grid-cols-2 border-t border-l border-line md:grid-cols-4">
        {site.clients.map((c) => (
          <RevealItem
            key={c}
            className="flex min-h-36 items-center justify-center border-b border-r border-line p-6 text-center font-display text-2xl font-semibold uppercase leading-tight text-fg-2 transition-colors hover:bg-bg-2 hover:text-fg md:min-h-44 md:text-3xl"
          >
            {c}
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
