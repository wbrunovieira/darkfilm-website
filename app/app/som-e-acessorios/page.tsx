import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Catalogo } from "@/components/Catalogo";
import { ContactCTA } from "@/components/ContactCTA";
import { catalogoSom } from "@/lib/produtos";

export const metadata: Metadata = {
  title: "Som e Acessórios",
  description:
    "Equipamentos nacionais e importados: kits multimídia, alarmes, sensores de ré, xenon, amplificadores, subwoofers, engates e acessórios em geral. Petrópolis/RJ.",
};

// Texto copiado da página "Som e Acessórios" do site original.
export default function SomEAcessoriosPage() {
  return (
    <>
      <PageHero
        eyebrow={`Som e Acessórios · ${catalogoSom.length} itens`}
        title={
          <>
            Nacionais e importados,
            <br />
            <span className="text-red-2">tudo em um lugar.</span>
          </>
        }
        intro="Trabalhamos com toda linha de equipamentos nacionais e importados, kits multimídia, alarmes, sensores de ré, xenon, amplificadores, subwoofers, engates e acessórios em geral. Faça-nos uma visita!"
        image="/img/hero/som.jpg"
      />
      <section className="container-x border-t border-line py-14 md:py-20">
        <Catalogo items={catalogoSom} />
      </section>
      <ContactCTA />
    </>
  );
}
