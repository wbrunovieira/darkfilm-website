"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

export type Photo = { src: string; w: number; h: number; alt?: string };

type Props = {
  photos: Photo[];
  /** Limita quantidade exibida (com botão "ver todas"). */
  limit?: number;
  columns?: "3" | "4";
};

export function PhotoGrid({ photos, limit, columns = "4" }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const reduce = useReducedMotion();

  const visible = limit && !showAll ? photos.slice(0, limit) : photos;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const cols = columns === "3" ? "sm:grid-cols-3" : "sm:grid-cols-3 lg:grid-cols-4";

  return (
    <>
      <ul className={`grid grid-cols-2 gap-2 md:gap-3 ${cols}`}>
        {visible.map((p, i) => (
          <li key={p.src}>
            <motion.button
              type="button"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -5% 0px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-bg-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
              aria-label={p.alt ?? `Abrir foto ${i + 1}`}
            >
              <Image
                src={p.src}
                alt={p.alt ?? ""}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="photo object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          </li>
        ))}
      </ul>

      {limit && photos.length > limit && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.18em] text-fg-2 transition-colors hover:border-red hover:text-fg"
        >
          Ver todas as {photos.length} fotos
        </button>
      )}

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Foto ampliada"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              key={photos[open].src}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[85vh] max-w-[92vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[open].src}
                alt={photos[open].alt ?? ""}
                width={photos[open].w}
                height={photos[open].h}
                sizes="92vw"
                className="photo max-h-[85vh] w-auto rounded-md object-contain"
                priority
              />
            </motion.div>

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-display text-sm tracking-[0.2em] text-fg-3">
              {open + 1} / {photos.length}
            </p>

            <button type="button" onClick={close} aria-label="Fechar" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-line-strong text-fg hover:border-red">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Anterior" className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong text-fg hover:border-red md:left-6">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Próxima" className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong text-fg hover:border-red md:right-6">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
