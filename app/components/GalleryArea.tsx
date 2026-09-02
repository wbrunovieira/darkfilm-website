import { Reveal } from "./Reveal";
import { PhotoGrid, type Photo } from "./PhotoGrid";

type Area = {
  id: string;
  title: string;
  intro: string;
  photos: Photo[];
};

/**
 * Uma área da galeria: título, contagem e a própria grade.
 *
 * O cliente pediu (áudio de 02/09/2026) que multimídia, arquitetura e aplicação de
 * película em carros fossem "áreas separadas", e não abas de um mesmo bloco — por isso
 * cada uma é uma seção própria, com âncora, em vez de um filtro.
 */
export function GalleryArea({ area, index }: { area: Area; index: number }) {
  if (area.photos.length === 0) return null;

  return (
    <section
      id={area.id}
      className={`scroll-mt-24 border-t border-line py-16 md:py-24 ${index % 2 === 1 ? "atmo atmo-soft" : ""}`}
    >
      <div className="container-x">
        <Reveal className="mb-8 flex flex-col gap-3 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3">Área {String(index + 1).padStart(2, "0")}</p>
            <h2 className="display text-3xl md:text-5xl">
              {area.title}
              <span className="text-red-2">.</span>
            </h2>
            <p className="mt-4 max-w-lg text-fg-2">{area.intro}</p>
          </div>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-fg-3">
            <span className="text-fg">{area.photos.length}</span>{" "}
            {area.photos.length === 1 ? "foto" : "fotos"}
          </p>
        </Reveal>

        <PhotoGrid photos={area.photos} variant="editorial" label={area.title} />
      </div>
    </section>
  );
}
