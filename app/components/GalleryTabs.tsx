"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { PhotoGrid, type Photo } from "./PhotoGrid";

type Album = { title: string; photos: Photo[] };

export function GalleryTabs({ albums }: { albums: Album[] }) {
  const [active, setActive] = useState("todas");

  const all = useMemo(() => albums.flatMap((a) => a.photos), [albums]);
  const tabs = useMemo(
    () => [{ id: "todas", title: "Todas", n: all.length }, ...albums.map((a) => ({ id: a.title, title: a.title, n: a.photos.length }))],
    [albums, all.length],
  );
  const current = active === "todas" ? all : (albums.find((a) => a.title === active)?.photos ?? all);
  const label = tabs.find((t) => t.id === active)?.title ?? "Todas";

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div role="tablist" aria-label="Álbuns" className="flex flex-wrap gap-2">
          {tabs.map((t) => {
            const selected = active === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="galeria-panel"
                onClick={() => setActive(t.id)}
                className="pill-tab"
              >
                {selected && (
                  <motion.span
                    layoutId="galeria-pill"
                    className="pill-tab__bg"
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  />
                )}
                {t.title}
                <span className="pill-tab__count">{t.n}</span>
              </button>
            );
          })}
        </div>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-fg-3" aria-live="polite">
          <span className="text-fg">{current.length}</span> {current.length === 1 ? "foto" : "fotos"}
          {active !== "todas" && <> · {label}</>}
        </p>
      </div>

      <div role="tabpanel" id="galeria-panel" aria-label={label}>
        <PhotoGrid photos={current} variant="editorial" label={label} animateLayout />
      </div>
    </div>
  );
}
