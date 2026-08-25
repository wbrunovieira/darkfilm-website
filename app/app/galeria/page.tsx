import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { GalleryTabs } from "@/components/GalleryTabs";
import { ContactCTA } from "@/components/ContactCTA";
import galeria from "@/content/galeria.json";

export const metadata: Metadata = {
  title: "Galeria de Fotos",
  description:
    "Trabalhos da The Dark Film: película arquitetônica e automotiva, envelopamento e acessórios automotivos em Petrópolis/RJ.",
};

const albums = galeria.map((a) => ({
  title: a.title.replace(/^Film /, ""),
  photos: a.photos.map((p) => ({ ...p, alt: a.title })),
}));
const total = albums.reduce((n, a) => n + a.photos.length, 0);

export default function GaleriaPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow={`Galeria · ${total} fotos`}
        title={
          <>
            Trabalhos <span className="text-red-2">de verdade.</span>
          </>
        }
        intro="Película arquitetônica e automotiva, envelopamento e acessórios: o que sai da oficina."
      />
      <section className="container-x pb-24">
        <GalleryTabs albums={albums} />
      </section>
      <ContactCTA />
    </>
  );
}
