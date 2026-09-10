"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CATALOGO, reais } from "@/content/painel-mock";
import { Botao, Painel, Selo, TituloSecao } from "./ui";

/** Lista de produtos: a tela que o lojista mais vai usar, e a que mais vai aparecer no print. */
export function ProdutosTab({ onEditar }: { onEditar: (id: string) => void }) {
  const [busca, setBusca] = useState("");
  const [cat, setCat] = useState("Todas");

  const categorias = ["Todas", ...new Set(CATALOGO.map((p) => p.categoria))];

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return CATALOGO.filter(
      (p) =>
        (cat === "Todas" || p.categoria === cat) &&
        (!q || p.nome.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)),
    );
  }, [busca, cat]);

  return (
    <>
      <TituloSecao
        titulo="Produtos"
        apoio={`${CATALOGO.length} cadastrados, ${CATALOGO.filter((p) => p.status === "ativo").length} ativos`}
        acao={<Botao tom="forte" onClick={() => onEditar("1")}>+ Novo produto</Botao>}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-bg-2 px-3 py-2.5 md:max-w-sm">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-fg-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Buscar produto</span>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou código"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-3"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`min-h-10 rounded-lg border px-3.5 text-xs font-semibold transition-colors ${
                cat === c ? "border-red bg-red text-white" : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Painel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[0.68rem] uppercase tracking-[0.12em] text-fg-3">
                <th className="px-4 py-3 font-semibold">Produto</th>
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Marca</th>
                <th className="px-4 py-3 text-right font-semibold">Preço</th>
                <th className="px-4 py-3 text-right font-semibold">Estoque</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id} className="border-b border-line/60 transition-colors last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-bg-3">
                        <Image src={p.img} alt="" fill sizes="44px" className="object-cover" />
                      </span>
                      <span>
                        <span className="block whitespace-nowrap font-medium text-fg">{p.nome}</span>
                        {p.temVariacoes && <span className="whitespace-nowrap text-xs text-fg-3">com variações de tamanho</span>}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-fg-3">{p.codigo}</td>
                  <td className="px-4 py-3 text-fg-2">{p.categoria}</td>
                  <td className="px-4 py-3 text-fg-2">{p.marca}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {p.precoDe && <s className="mr-1.5 text-xs text-fg-3">{reais(p.precoDe)}</s>}
                    <span className={p.precoDe ? "text-red-2" : ""}>{reais(p.preco)}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className={p.estoque === 0 ? "text-red-2" : p.estoque <= 8 ? "text-amber-300" : "text-fg-2"}>
                      {p.estoque}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === "ativo" ? <Selo tom="ok">Ativo</Selo> : <Selo tom="neutro">Inativo</Selo>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onEditar(p.id)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-fg-3 transition-colors hover:bg-white/5 hover:text-red-2"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {lista.length === 0 && (
          <p className="px-4 py-12 text-center text-sm text-fg-3">Nenhum produto encontrado.</p>
        )}
      </Painel>
    </>
  );
}
