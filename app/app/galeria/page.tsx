import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { GalleryArea } from "@/components/GalleryArea";
import { ContactCTA } from "@/components/ContactCTA";
import areas from "@/content/galeria-areas.json";

export const metadata: Metadata = {
  title: "Galeria de Fotos",
  description:
    "Trabalhos da The Dark Film: película arquitetônica e automotiva, envelopamento, multimídia e acessórios em Petrópolis/RJ.",
};

const total = areas.reduce((n, a) => n + a.photos.length, 0);

export default function GaleriaPage() {
  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Início", href: "/" }, { label: "Galeria" }]}
        title={
          <>
            Trabalhos <span className="text-red-2">de verdade.</span>
          </>
        }
        intro={`Cada área com o que sai da oficina: aplicação de película, envelopamento, multimídia e os carros que passam por aqui. São ${total} fotos em ${areas.length} áreas.`}
      />

      {/* Índice das áreas: o cliente pediu áreas separadas, então elas precisam ser
          alcançáveis sem rolar a galeria inteira. */}
      <nav aria-label="Áreas da galeria" className="container-x pb-10">
        <ul className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <li key={a.id}>
              <a href={`#${a.id}`} className="pill-tab">
                {a.title}
                <span className="pill-tab__count">{a.photos.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {areas.map((a, i) => (
        <GalleryArea key={a.id} area={a} index={i} />
      ))}

      <ContactCTA />
    </>
  );
}
