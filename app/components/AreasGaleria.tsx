"use client";

import { useEffect, useState } from "react";

/**
 * Índice das áreas da galeria, com a área visível marcada.
 *
 * Sem a marcação, depois de pular para "Envelopamento" não havia como saber onde se estava
 * entre 99 fotos — a auditoria de navegação classificou isso como perda de posição, a mesma
 * família de problema do menu que não acendia.
 */
export function AreasGaleria({ areas }: { areas: { id: string; title: string; n: number }[] }) {
  const [atual, setAtual] = useState<string | null>(null);

  useEffect(() => {
    const alvos = areas
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => !!el);
    if (!alvos.length) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        // a área "atual" é a que está mais alta na tela entre as visíveis
        const visiveis = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visiveis[0]) setAtual(visiveis[0].target.id);
      },
      // a faixa de leitura é o terço superior: é onde o olho está depois de um pulo por âncora
      { rootMargin: "-20% 0px -66% 0px", threshold: 0 },
    );
    alvos.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [areas]);

  return (
    <nav aria-label="Áreas da galeria" className="container-x pb-10">
      <ul className="flex flex-wrap gap-2">
        {areas.map((a) => (
          <li key={a.id}>
            <a
              href={`#${a.id}`}
              aria-current={atual === a.id ? "true" : undefined}
              className="pill-tab"
            >
              {a.title}
              <span className="pill-tab__count">{a.n}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
