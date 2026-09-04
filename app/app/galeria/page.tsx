import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AreasGaleria } from "@/components/AreasGaleria";
import { GalleryArea } from "@/components/GalleryArea";
import { ContactCTA } from "@/components/ContactCTA";
import { ProximoPasso } from "@/components/ProximoPasso";
import areas from "@/content/galeria-areas.json";

export const metadata: Metadata = {
  title: "Galeria de Fotos",
  description:
    "Trabalhos da The Dark Film: película automotiva e arquitetônica, multimídia e acessórios, em Petrópolis/RJ.",
};

// A galeria tem foto e vídeo: contar tudo como "fotos" no texto seria impreciso.
const itens = areas.flatMap((a) => a.photos);
const nVideos = itens.filter((i) => "video" in i).length;
const nFotos = itens.length - nVideos;

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
        intro={`Cada área com o que sai da oficina: aplicação de película, envelopamento, multimídia e os carros que passam por aqui. São ${nFotos} fotos e ${nVideos} vídeos em ${areas.length} áreas.`}
      />

      {/* Índice das áreas: o cliente pediu áreas separadas, então elas precisam ser
          alcançáveis sem rolar a galeria inteira. */}
      <AreasGaleria areas={areas.map((a) => ({ id: a.id, title: a.title, n: a.photos.length }))} />

      {areas.map((a, i) => (
        <GalleryArea key={a.id} area={a} index={i} />
      ))}

      <ProximoPasso
        titulo="O que fazemos"
        itens={[
          { href: "/peliculas-automotivas", label: "Películas Automotivas", texto: "Película de controle solar e segurança, e envelopamento." },
          { href: "/som-e-acessorios", label: "Som e Acessórios", texto: "Multimídia, alarmes, sensores e acessórios." },
          { href: "/a-empresa", label: "A Empresa", texto: "Quem faz esses trabalhos, em Petrópolis desde 1992." },
        ]}
      />

      <ContactCTA />
    </>
  );
}
