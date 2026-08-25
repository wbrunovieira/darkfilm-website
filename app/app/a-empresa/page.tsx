import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Stat } from "@/components/Section";
import { ContactCTA } from "@/components/ContactCTA";
import { site, yearsInBusiness } from "@/lib/site";

export const metadata: Metadata = {
  title: "A Empresa",
  description:
    "Fundada em 1992 em Petrópolis/RJ, a The Dark Film é a mais experiente e reconhecida em película, envelopamento, som, alarmes e recuperação de para-brisas da região.",
};

// Texto copiado da página "A Empresa" do site original.
export default function AEmpresaPage() {
  return (
    <>
      <PageHero
        eyebrow="A Empresa"
        title={
          <>
            A mais experiente
            <br />
            e reconhecida <span className="text-red-2">da região.</span>
          </>
        }
        intro="Fundada em 1992, em Petrópolis-RJ, a The Dark Film vem prestando serviços de alto nível para seus clientes, tornando-se a mais experiente e reconhecida no mercado."
        image="/img/marca/loja.jpg"
        imagePosition="center 40%"
      />

      <section className="container-x grid gap-10 border-t border-line py-16 md:grid-cols-3 md:py-24">
        <Reveal>
          <Stat value={String(site.founded)} label="Ano de fundação, em Petrópolis/RJ" />
        </Reveal>
        <Reveal delay={0.1}>
          <Stat value={`${yearsInBusiness()}`} label="Anos de mercado" />
        </Reveal>
        <Reveal delay={0.2}>
          <Stat value="3M" label="Aplicadora credenciada" />
        </Reveal>
      </section>

      <section className="container-x grid gap-10 border-t border-line py-16 md:grid-cols-[1fr_1.6fr] md:gap-16 md:py-24">
        <Reveal>
          <p className="eyebrow mb-3">Missão</p>
          <h2 className="display text-3xl md:text-5xl">Qualidade e rapidez.</h2>
        </Reveal>
        <Reveal delay={0.1} className="prose-dark">
          <p>
            Nossa missão é executar serviços com qualidade e rapidez, buscando sempre a
            satisfação total do cliente.
          </p>
          <p>
            Dentre os serviços oferecidos podemos citar: aplicação de película de controle solar
            e segurança, envelopamento, instalação de som, alarmes, acessórios e recuperação de
            para-brisas.
          </p>
        </Reveal>
      </section>

      <section className="container-x border-t border-line py-16 md:py-24">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">Clientes</p>
          <h2 className="display max-w-3xl text-3xl md:text-5xl">
            Nossa qualidade é atestada pelo serviço prestado aos clientes, entre eles:
          </h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 border-t border-l border-line md:grid-cols-4">
          {site.clients.map((c) => (
            <RevealItem
              key={c}
              className="flex min-h-36 items-center justify-center border-b border-r border-line p-6 text-center font-display text-2xl font-semibold uppercase leading-tight text-fg-2 md:min-h-44 md:text-3xl"
            >
              {c}
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="container-x pb-8">
        <Reveal className="relative aspect-[16/7] overflow-hidden rounded-lg">
          <Image
            src="/img/marca/loja.jpg"
            alt="Interior da loja da The Dark Film em Petrópolis"
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="photo object-cover"
          />
        </Reveal>
      </section>

      <ContactCTA />
    </>
  );
}
