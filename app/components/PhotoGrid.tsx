"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon } from "./icons/catalogo";

export type Photo = { src: string; w: number; h: number; alt?: string; album?: string };

const ease = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */

type LightboxProps = {
  photos: Photo[];
  index: number | null;
  onChange: (i: number | null) => void;
  /** Rótulo do conjunto (ex.: nome do álbum ou do produto). */
  label?: string;
};

export function Lightbox({ photos, index, onChange, label }: LightboxProps) {
  const [dir, setDir] = useState(0);
  const open = index !== null;
  const total = photos.length;

  const close = useCallback(() => onChange(null), [onChange]);
  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      setDir(d);
      onChange((index + d + total) % total);
    },
    [index, total, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  // Pré-carrega vizinhas para a troca ser instantânea
  useEffect(() => {
    if (index === null || total < 2) return;
    [1, -1].forEach((d) => {
      const img = new window.Image();
      img.src = photos[(index + d + total) % total].src;
    });
  }, [index, photos, total]);

  const photo = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {photo && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${label ? label + " — " : ""}foto ${index + 1} de ${total}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="lb"
          onClick={close}
        >
          <div className="lb__progress" aria-hidden>
            <i style={{ transform: `scaleX(${(index + 1) / total})` }} />
          </div>

          <div className="lb__bar" onClick={(e) => e.stopPropagation()}>
            <div className="min-w-0">
              {(photo.album ?? label) && (
                <p className="truncate font-display text-sm font-semibold uppercase tracking-[0.12em] text-fg">
                  {photo.album ?? label}
                </p>
              )}
              {photo.alt && photo.alt !== (photo.album ?? label) && (
                <p className="truncate text-xs text-fg-3">{photo.alt}</p>
              )}
            </div>
            <button type="button" onClick={close} aria-label="Fechar (Esc)" className="lb__btn">
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div className="lb__stage">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={photo.src}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 40, scale: 0.98 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d: number) => ({ opacity: 0, x: d * -40, scale: 0.98 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease }}
                drag={total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -400) step(1);
                  else if (info.offset.x > 60 || info.velocity.x > 400) step(-1);
                }}
                onClick={(e) => e.stopPropagation()}
                className="grain grid place-items-center overflow-hidden rounded-md"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt ?? ""}
                  width={photo.w}
                  height={photo.h}
                  sizes="92vw"
                  className="lb__img photo object-contain"
                  priority
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Foto anterior"
                  className="lb__btn lb__nav lb__nav--prev"
                >
                  <ChevronLeftIcon className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Próxima foto"
                  className="lb__btn lb__nav lb__nav--next"
                >
                  <ChevronRightIcon className="size-5" />
                </button>
              </>
            )}
          </div>

          <div className="lb__foot" onClick={(e) => e.stopPropagation()}>
            <p className="lb__counter" aria-live="polite">
              {String(index + 1).padStart(2, "0")} <small>/ {String(total).padStart(2, "0")}</small>
            </p>
            <p className="lb__hint" aria-hidden>
              <kbd>←</kbd>
              <kbd>→</kbd> navegar
              <span className="mx-1 opacity-40">·</span>
              <kbd>Esc</kbd> fechar
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Galeria de produto: palco + miniaturas                              */
/* ------------------------------------------------------------------ */

export function ProductGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const photo = photos[current];
  if (!photo) return null;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(current)}
        className="prod-stage block w-full"
        aria-label={`Ampliar foto ${current + 1} de ${photos.length}`}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="absolute inset-0"
          >
            <Image
              src={photo.src}
              alt={`${title} — foto ${current + 1}`}
              fill
              priority={current === 0}
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-contain p-6 md:p-8"
            />
          </motion.div>
        </AnimatePresence>
        <span className="prod-stage__zoom" aria-hidden>
          <ExpandIcon className="size-4" />
        </span>
      </button>

      {photos.length > 1 && (
        <div className="prod-thumbs" role="group" aria-label="Fotos do produto">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setCurrent(i)}
              aria-current={i === current}
              aria-label={`Foto ${i + 1}`}
              className="prod-thumb"
            >
              <Image src={p.src} alt="" fill sizes="12vw" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}

      <Lightbox photos={photos} index={open} onChange={setOpen} label={title} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grid                                                                */
/* ------------------------------------------------------------------ */

type Props = {
  photos: Photo[];
  /** Limita quantidade exibida (com botão "ver todas"). */
  limit?: number;
  /** `editorial`: fotos-herói 2×2 em ritmo, legenda no hover. `uniform`: grade simples. */
  variant?: "editorial" | "uniform";
  /** Rótulo do conjunto para o lightbox. */
  label?: string;
  /** Anima reordenação/filtro (layout). Use quando a lista muda em tempo real. */
  animateLayout?: boolean;
};

export function PhotoGrid({ photos, limit, variant = "uniform", label, animateLayout }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visible = limit && !showAll ? photos.slice(0, limit) : photos;

  const listClass =
    variant === "editorial" ? "gal-grid" : "grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-4";

  return (
    <>
      <motion.ul layout={animateLayout} className={listClass}>
        <AnimatePresence mode={animateLayout ? "popLayout" : "sync"} initial={false}>
          {visible.map((p, i) => (
            <motion.li
              key={p.src}
              layout={animateLayout}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease, delay: animateLayout ? Math.min(i, 12) * 0.02 : 0 }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="gal-tile"
                aria-label={`Ampliar foto ${i + 1}${p.album ? ` — ${p.album}` : ""}`}
              >
                <Image
                  src={p.src}
                  alt={p.alt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 640px) 66vw, 100vw"
                  className="photo object-cover"
                />
                <span className="gal-tile__cap" aria-hidden>
                  <span>
                    {p.album && <span className="gal-tile__cap-title">{p.album}</span>}
                    <span className="gal-tile__cap-n">
                      {String(i + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="gal-tile__cap-ico">
                    <ExpandIcon className="size-4" />
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {limit && photos.length > limit && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.18em] text-fg-2 transition-colors hover:border-red hover:text-fg"
        >
          Ver todas as {photos.length} fotos
        </button>
      )}

      <Lightbox photos={visible} index={open} onChange={setOpen} label={label} />
    </>
  );
}
