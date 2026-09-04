"use client";

import Image from "next/image";
import { desconto, reais, type ProdutoLoja } from "@/content/loja-mock";

/**
 * Cópia do Card do Stylos: mesma anatomia — imagem com selos girados 45° no canto, badge de
 * desconto, categoria, título com tooltip no hover, preço riscado + preço final, botão.
 *
 * O que mudou é a pele: o Stylos é claro (bg-white, borda rosa), a The Dark Film é escura.
 * A estrutura ficou igual para o projeto real ser um transplante e não uma reescrita.
 */
export default function Card({ p, naSacola, onAdd }: {
  p: ProdutoLoja;
  naSacola: number;
  onAdd: (p: ProdutoLoja) => void;
}) {
  const off = desconto(p);

  return (
    <div className="m-1 flex h-[26rem] transform flex-col rounded-md border border-line bg-bg-2 shadow-lg transition duration-300 ease-in-out hover:scale-[1.03] hover:border-line-strong hover:shadow-2xl">
      <div className="relative h-[200px] flex-shrink-0 overflow-hidden rounded-t-md bg-bg-3">
        <Image
          src={p.img}
          alt={p.nome}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover object-center"
        />

        {/* Faixas girando 45° no canto, como no Stylos */}
        {p.precoDe && (
          <div className="absolute -left-9 top-4 w-32 -rotate-45 bg-red py-1 text-center font-display text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white">
            Promoção
          </div>
        )}
        {p.novidade && !p.precoDe && (
          <div className="absolute -left-9 top-4 w-32 -rotate-45 bg-gold py-1 text-center font-display text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-bg">
            Novidade
          </div>
        )}
        {off > 0 && (
          <div className="absolute right-2 top-2 rounded bg-bg/85 px-2 py-1 font-display text-xs font-semibold tabular-nums text-red-2 backdrop-blur">
            −{off}%
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between px-5 py-4">
        <div>
          <h3 className="font-display text-[0.68rem] uppercase tracking-[0.16em] text-red-2">
            {p.categoria}
          </h3>

          <div className="group relative">
            <h2 className="mb-1 truncate font-display text-lg font-semibold text-fg">{p.nome}</h2>
            {/* tooltip do Stylos: o nome inteiro quando ele não cabe */}
            <div className="pointer-events-none absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 rounded-lg bg-bg-3 px-2 py-1 text-[10px] text-fg opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100">
              {p.nome}
            </div>
          </div>

          <p className="text-sm text-fg-3">{p.detalhe}</p>
          {p.tamanhos && (
            <p className="mt-2 flex gap-1.5">
              {p.tamanhos.map((t) => (
                <span key={t} className="rounded border border-line px-1.5 py-0.5 text-[0.68rem] text-fg-2">
                  {t}
                </span>
              ))}
            </p>
          )}

          <p className="mt-3 text-sm font-bold">
            {p.precoDe && (
              <span className="mr-2 font-extralight text-fg-3 line-through">{reais(p.precoDe)}</span>
            )}
            <span className="display text-2xl tabular-nums text-fg">{reais(p.preco)}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAdd(p)}
          className="mt-3 min-h-11 w-full rounded-full border border-line-strong font-display text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:border-red hover:bg-red hover:text-white"
        >
          {naSacola ? `Na sacola · ${naSacola}` : "Adicionar"}
        </button>
      </div>
    </div>
  );
}
