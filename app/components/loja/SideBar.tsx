"use client";

import { CATEGORIAS, MARCAS, TAMANHOS, reais } from "@/content/loja-mock";

export type Filtros = {
  categorias: string[];
  marcas: string[];
  tamanhos: string[];
  precoMax: number;
};

/**
 * Cópia da SideBar do Stylos: blocos empilhados com título, régua degradê e caixas de seleção —
 * lá são Categorias, Marcas, Cores e Tamanhos, mais faixa de preço. Aqui Cores saiu (não faz
 * sentido para acessório automotivo) e o resto ficou.
 *
 * Escondida no celular, como no Stylos (`hidden md:flex`): lá o filtro no celular é outra tela.
 */
export default function SideBar({ f, setF, max }: {
  f: Filtros;
  setF: (f: Filtros) => void;
  max: number;
}) {
  const alterna = (campo: "categorias" | "marcas" | "tamanhos", v: string) =>
    setF({
      ...f,
      [campo]: f[campo].includes(v) ? f[campo].filter((x) => x !== v) : [...f[campo], v],
    });

  return (
    <aside className="hidden flex-col gap-2 md:flex" aria-label="Filtros">
      <Bloco titulo="Categorias">
        {CATEGORIAS.map((c) => (
          <Caixa key={c} rotulo={c} marcada={f.categorias.includes(c)} onChange={() => alterna("categorias", c)} />
        ))}
      </Bloco>

      <Bloco titulo="Marcas">
        {MARCAS.map((m) => (
          <Caixa key={m} rotulo={m} marcada={f.marcas.includes(m)} onChange={() => alterna("marcas", m)} />
        ))}
      </Bloco>

      <Bloco titulo="Tamanhos">
        <div className="flex flex-wrap gap-2">
          {TAMANHOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => alterna("tamanhos", t)}
              aria-pressed={f.tamanhos.includes(t)}
              className={`min-h-9 min-w-9 rounded border px-2 text-xs font-semibold transition-colors ${
                f.tamanhos.includes(t)
                  ? "border-red bg-red text-white"
                  : "border-line-strong text-fg-2 hover:border-fg-3 hover:text-fg"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Preço">
        <label className="block text-xs text-fg-2">
          Até <strong className="text-fg tabular-nums">{reais(f.precoMax)}</strong>
          <input
            type="range"
            min={1000}
            max={max}
            step={1000}
            value={f.precoMax}
            onChange={(e) => setF({ ...f, precoMax: Number(e.target.value) })}
            className="mt-3 w-full accent-[var(--red)]"
          />
        </label>
      </Bloco>

      <button
        type="button"
        onClick={() => setF({ categorias: [], marcas: [], tamanhos: [], precoMax: max })}
        className="mt-2 min-h-10 rounded border border-line px-3 text-xs uppercase tracking-[0.14em] text-fg-3 transition-colors hover:border-red hover:text-red-2"
      >
        Limpar filtros
      </button>
    </aside>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-2 flex w-full flex-col rounded border border-line bg-bg-2 p-4">
      <h2 className="mb-2 font-display text-sm uppercase tracking-[0.16em] text-fg">{titulo}</h2>
      {/* a régua degradê da sidebar do Stylos */}
      <hr className="mb-4 h-[2px] border-0 bg-gradient-to-r from-red to-transparent" />
      {children}
    </section>
  );
}

function Caixa({ rotulo, marcada, onChange }: { rotulo: string; marcada: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1.5 text-xs text-fg-2 transition-colors hover:text-fg">
      <input type="checkbox" checked={marcada} onChange={onChange} className="accent-[var(--red)]" />
      {rotulo}
    </label>
  );
}
