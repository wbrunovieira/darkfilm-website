"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Lightbox } from "./PhotoGrid";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { ExpandIcon } from "./icons/catalogo";
import { CATEGORIAS } from "@/content/som-categorias";

/**
 * As 11 categorias de Som e Acessórios.
 *
 * Substitui a grade de 41 produtos individuais, a pedido do cliente em 22/09/2026: "deixar a
 * página mais atual, limpa e organizada por categoria".
 *
 * **Por que não é um componente de galeria novo.** Ele pediu avançar/voltar, ampliar e deslize
 * no celular — que é exatamente o que o `Lightbox` do site já faz, e já está testado nas outras
 * páginas. O que este componente acrescenta é só quem alimenta o lightbox: em vez de uma lista
 * fixa, o conjunto da categoria que a pessoa clicou. Escrever um segundo lightbox seria manter
 * dois comportamentos de navegação de foto no mesmo site.
 *
 * **Uma só imagem por cartão na página.** Palavras dele: "manter a página principal limpa,
 * mostrando apenas foto de capa + título + descrição curta, deixando as demais fotos disponíveis
 * somente quando o cliente abrir aquela categoria". As 33 fotos restantes não são nem baixadas
 * antes do clique.
 */
export function CategoriasSom() {
  /** Categoria aberta e índice dentro dela. `null` = lightbox fechado. */
  const [aberta, setAberta] = useState<{ cat: number; foto: number } | null>(null);
  const cat = aberta !== null ? CATEGORIAS[aberta.cat] : null;

  /* `useCallback` porque o Lightbox usa `onChange` em dependência de efeito: uma arrow nova a
     cada render faria ele remover e recolocar o listener de teclado o tempo todo. */
  const trocar = useCallback(
    (i: number | null) => setAberta((a) => (i === null || a === null ? null : { ...a, foto: i })),
    [],
  );

  return (
    <>
      <RevealGroup
        stagger={0.06}
        role="list"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {CATEGORIAS.map((c, i) => {
          const tem = c.fotos.length > 1;
          return (
            <RevealItem key={c.id} role="listitem" className="h-full">
              <article id={c.id} className="cat-som scroll-mt-28 flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg-2">
                <button
                  type="button"
                  onClick={() => setAberta({ cat: i, foto: 0 })}
                  className="group relative block aspect-[4/3] w-full overflow-hidden"
                  aria-label={
                    tem
                      ? `Abrir as ${c.fotos.length} fotos de ${c.titulo}`
                      : `Ampliar a foto de ${c.titulo}`
                  }
                >
                  <Image
                    src={c.capa.src}
                    alt={c.capa.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={`transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                      /* Foto de trabalho preenche o quadro; imagem de catálogo de 2013 vem com
                         fundo branco recortado e tem que respirar, senão o produto encosta na
                         borda e o quadro parece um erro de corte. */
                      c.capa.real ? "object-cover" : "bg-white object-contain p-6"
                    }`}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <span className="cat-som__zoom" aria-hidden>
                    <ExpandIcon className="size-4" />
                    {tem && <b>{String(c.fotos.length).padStart(2, "0")}</b>}
                  </span>
                </button>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="font-display text-lg font-semibold uppercase leading-tight tracking-[0.02em] text-fg md:text-xl">
                    {c.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-2">{c.texto}</p>
                </div>
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <Reveal delay={0.1}>
        <p className="mt-6 text-xs text-fg-3">
          Disponibilidade, modelos e valores sob consulta pelo WhatsApp.
        </p>
      </Reveal>

      {/* Sempre montado, com `index={null}` quando fechado — e não `{cat && <Lightbox/>}`.
          O <AnimatePresence> que anima a saída vive DENTRO do Lightbox: desmontando o
          componente ao fechar, a animação de saída nunca chega a rodar e o lightbox some de
          estalo aqui, enquanto dissolve na galeria e nas páginas de produto. Mesmo componente,
          dois comportamentos. */}
      <Lightbox
        photos={(cat ?? CATEGORIAS[0]).fotos}
        index={aberta?.foto ?? null}
        onChange={trocar}
        label={(cat ?? CATEGORIAS[0]).titulo}
      />
    </>
  );
}
