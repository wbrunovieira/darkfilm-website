"use client";

import { useState } from "react";
import { PhotoGrid, type Photo } from "./PhotoGrid";

type Album = { title: string; photos: Photo[] };

export function GalleryTabs({ albums }: { albums: Album[] }) {
  const [active, setActive] = useState(0);
  const all: Album = { title: "Todas", photos: albums.flatMap((a) => a.photos) };
  const tabs = [all, ...albums];
  const current = tabs[active];

  return (
    <div>
      <div role="tablist" aria-label="Álbuns" className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <button
            key={t.title}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`rounded-full border px-4 py-2 font-display text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${
              active === i
                ? "border-red bg-red text-white"
                : "border-line-strong text-fg-2 hover:border-fg-3 hover:text-fg"
            }`}
          >
            {t.title} <span className="ml-1 opacity-60">{t.photos.length}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" key={current.title}>
        <PhotoGrid photos={current.photos} />
      </div>
    </div>
  );
}
