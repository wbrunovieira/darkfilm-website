"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { grupos, type Produto } from "@/lib/produtos";
import { ArrowIcon } from "./icons";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function Catalogo({ items }: { items: Produto[] }) {
  const [grupo, setGrupo] = useState<string>("todos");
  const [q, setQ] = useState("");
  const reduce = useReducedMotion();

  const list = useMemo(() => {
    const slugs = grupo === "todos" ? null : new Set(grupos.find((g) => g.id === grupo)?.slugs);
    const nq = normalize(q.trim());
    return items.filter(
      (p) =>
        (!slugs || slugs.has(p.slug)) &&
        (!nq || normalize(p.title + " " + p.description).includes(nq)),
    );
  }, [items, grupo, q]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Grupos" className="flex flex-wrap gap-2">
          {[{ id: "todos", nome: "Todos" }, ...grupos].map((g) => (
            <button
              key={g.id}
              role="tab"
              aria-selected={grupo === g.id}
              onClick={() => setGrupo(g.id)}
              className={`rounded-full border px-4 py-2 font-display text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${
                grupo === g.id ? "border-red bg-red text-white" : "border-line-strong text-fg-2 hover:border-fg-3 hover:text-fg"
              }`}
            >
              {g.nome}
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Buscar produto</span>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-fg-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar no catálogo…"
            className="w-full rounded-full border border-line-strong bg-bg-2 py-2.5 pl-11 pr-4 text-sm text-fg placeholder:text-fg-3 outline-none transition-colors focus:border-red"
          />
        </label>
      </div>

      <p className="mb-5 font-display text-xs uppercase tracking-[0.2em] text-fg-3" aria-live="polite">
        {list.length} {list.length === 1 ? "item" : "itens"}
      </p>

      <motion.ul layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/produtos/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg-2 transition-colors hover:border-line-strong"
              >
                <div className="relative aspect-square overflow-hidden bg-white">
                  {p.photos[0] && (
                    <Image
                      src={p.photos[0].src}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-contain p-4 transition-transform duration-700 ease-out-expo group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 items-end justify-between gap-3 p-4">
                  <h3 className="font-display text-lg font-semibold uppercase leading-none md:text-xl">{p.title}</h3>
                  <ArrowIcon className="size-5 shrink-0 text-fg-3 transition-all group-hover:translate-x-1 group-hover:text-red-2" />
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {list.length === 0 && (
        <p className="rounded-md border border-line p-8 text-center text-fg-2">
          Nenhum item encontrado para &ldquo;{q}&rdquo;. Fale com a gente pelo WhatsApp — trabalhamos
          com toda linha de equipamentos nacionais e importados.
        </p>
      )}
    </div>
  );
}
