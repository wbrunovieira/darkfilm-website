import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Reveal } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { site } from "@/lib/site";
import eventos from "@/content/eventos.json";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Registro histórico da The Dark Film em eventos: Itaipava Tuning Show, Salão do Automóvel, Extreme Motors Sport, Museu do Automóvel em Tiradentes, Kombi RatLook e viagens.",
};

// Título original termina em " - dd/mm/aaaa"; separamos data e nome, e ordenamos do mais recente.
function parse(title: string) {
  const m = title.match(/^(.*?)\s*-\s*(\d{2})\/(\d{2})\/(\d{4})\s*$/);
  if (!m) return { name: title.trim(), date: null as Date | null, label: "" };
  const [, name, d, mo, y] = m;
  return {
    name: name.replace(/\s+-\s*$/, "").replace(/\s{2,}/g, " ").trim(),
    date: new Date(Number(y), Number(mo) - 1, Number(d)),
    label: `${d}/${mo}/${y}`,
  };
}

const albums = eventos
  .map((a) => ({ ...parse(a.title), photos: a.photos.map((p) => ({ ...p, alt: a.title })) }))
  .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));

const years = albums.map((a) => a.date?.getFullYear()).filter(Boolean) as number[];
const range = `${Math.min(...years)}–${Math.max(...years)}`;

export default function EventosPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow={`Eventos · acervo ${range}`}
        title={
          <>
            Por aí, <span className="text-red-2">desde sempre.</span>
          </>
        }
        intro={
          <p>
            Registro histórico da {site.shortName} em salões, encontros e viagens. As fotos
            abaixo são do nosso acervo de {range}.
          </p>
        }
      />

      <div className="container-x space-y-6 pb-24">
        {albums.map((a, i) => (
          <Reveal key={a.name} className="rounded-lg border border-line bg-bg-2 p-5 md:p-8">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <div>
                <p className="font-display text-sm text-fg-3">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="display mt-1 text-2xl md:text-4xl">{a.name}</h2>
              </div>
              <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-fg-3">
                {a.label} · {a.photos.length} fotos
              </p>
            </div>
            <PhotoGrid photos={a.photos} limit={8} />
          </Reveal>
        ))}
      </div>

      <ContactCTA />
    </>
  );
}
