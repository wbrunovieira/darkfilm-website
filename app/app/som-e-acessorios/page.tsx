import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Catalogo } from "@/components/Catalogo";
import { ContactCTA } from "@/components/ContactCTA";
import { Reveal } from "@/components/Reveal";
import { catalogoSom, grupos } from "@/lib/produtos";

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
        eyebrow={`Som e Acessórios · ${catalogoSom.length} itens · ${grupos.length} grupos`}
        title={
          <>
            Nacionais e importados,
            <br />
            <span className="text-red-2">tudo em um lugar.</span>
          </>
        }
        intro="Trabalhamos com toda linha de equipamentos nacionais e importados, kits multimídia, alarmes, sensores de ré, xenon, amplificadores, subwoofers, engates e acessórios em geral. Faça-nos uma visita!"
        /* Painel de Volvo com a central instalada e a câmera de ré na tela, com a parede
           da oficina aparecendo pelo para-brisa: liga o equipamento ao lugar onde ele é
           instalado. Enquadrado a 38% para cortar as pernas de quem fotografou, no rodapé. */
        image="/img/novo/multimidia--volvo-camera-re.jpg"
        imagePosition="center 38%"
      />

      <section className="relative isolate overflow-hidden border-t border-line py-14 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_100%_0%,rgba(209,20,31,0.08),transparent_70%),radial-gradient(50%_40%_at_0%_100%,rgba(255,255,255,0.03),transparent_70%)]"
        />
        <div className="container-x">
          <Reveal className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3">Catálogo</p>
              <h2 className="display text-3xl md:text-5xl">
                Escolha o grupo <span className="text-fg-3">ou busque.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-fg-2">
              Cada item abre uma página com fotos e descrição. Disponibilidade e valores sob consulta pelo WhatsApp.
            </p>
          </Reveal>
          <Catalogo items={catalogoSom} />
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
