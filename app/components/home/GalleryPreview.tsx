import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { ArrowIcon } from "../icons";

// 1 foto grande (2 colunas) + 4 = duas linhas fechadas no grid de 3 colunas.
const photos = ["08", "10", "11", "12", "09"];

export function GalleryPreview() {
  return (
    <section className="bg-bg-2 py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Trabalhos</p>
            <h2 className="display text-4xl md:text-6xl">Na oficina</h2>
          </div>
          <Link
            href="/galeria"
            className="group hidden items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-fg-2 hover:text-fg sm:inline-flex"
          >
            Ver galeria completa
            <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <RevealGroup className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {photos.map((p, i) => (
            <RevealItem
              key={p}
              className={`relative overflow-hidden rounded-md ${i === 0 ? "col-span-2 aspect-[16/9] md:col-span-2" : "aspect-[4/3]"}`}
            >
              <Image
                src={`/img/galeria/${p}.jpg`}
                alt="Trabalho realizado pela The Dark Film"
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="photo object-cover transition-transform duration-700 ease-out-expo hover:scale-105"
              />
            </RevealItem>
          ))}
        </RevealGroup>

        <Link
          href="/galeria"
          className="mt-8 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-fg-2 sm:hidden"
        >
          Ver galeria completa <ArrowIcon className="size-4" />
        </Link>
      </div>
    </section>
  );
}
