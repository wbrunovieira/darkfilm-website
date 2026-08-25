import { site } from "@/lib/site";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";

export function Clients() {
  return (
    <section className="container-x py-24 md:py-32">
      <Reveal className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">Quem confia</p>
        <h2 className="display text-4xl md:text-6xl">
          Nossa qualidade é atestada pelo serviço prestado aos clientes.
        </h2>
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
