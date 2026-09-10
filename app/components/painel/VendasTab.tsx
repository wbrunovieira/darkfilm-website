"use client";

import { MAIS_VENDIDOS, POR_DIA, VENDAS, reais } from "@/content/painel-mock";
import { Painel, TituloSecao } from "./ui";

/**
 * Resumo de vendas. Só faturamento de hoje, da semana e do mês, ticket médio, o gráfico por dia
 * e os produtos que mais saíram. Nada além disso: o que aparece aqui vira item de proposta.
 */
export function VendasTab() {
  const teto = Math.max(...POR_DIA.map((d) => d.valor));

  return (
    <>
      <TituloSecao titulo="Resumo de vendas" apoio="Período: setembro de 2026" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { r: "Vendas hoje", v: reais(VENDAS.hoje.valor), a: `${VENDAS.hoje.pedidos} pedidos` },
          { r: "Vendas na semana", v: reais(VENDAS.semana.valor), a: `${VENDAS.semana.pedidos} pedidos` },
          { r: "Vendas no mês", v: reais(VENDAS.mes.valor), a: `${VENDAS.mes.pedidos} pedidos` },
          { r: "Ticket médio", v: reais(VENDAS.ticketMedio), a: "por pedido, no mês" },
        ].map((c) => (
          <Painel key={c.r} className="p-5">
            <p className="font-display text-[0.7rem] uppercase tracking-[0.12em] text-fg-3">{c.r}</p>
            <p className="display mt-2 text-3xl tabular-nums">{c.v}</p>
            <p className="mt-1 text-xs text-fg-3">{c.a}</p>
          </Painel>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Painel className="p-5">
          <h3 className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.12em]">Faturamento por dia</h3>
          {/* A barra precisa de um pai com altura definida, senão a porcentagem não resolve e
              o gráfico sai vazio. Daí o container do meio com flex-1. */}
          <div className="flex h-56 gap-3">
            {POR_DIA.map((d) => (
              <div key={d.dia} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[0.65rem] tabular-nums text-fg-3">{reais(d.valor)}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-red-deep to-red"
                    style={{ height: `${Math.max(6, (d.valor / teto) * 100)}%` }}
                  />
                </div>
                <span className="text-[0.7rem] text-fg-3">{d.dia}</span>
              </div>
            ))}
          </div>
        </Painel>

        <Painel className="p-5">
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.12em]">Mais vendidos no mês</h3>
          <ol className="space-y-3">
            {MAIS_VENDIDOS.map((m, i) => (
              <li key={m.nome} className="flex items-center gap-3 border-b border-line/60 pb-3 text-sm last:border-0 last:pb-0">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-bg-3 font-display text-xs text-fg-3">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-fg">{m.nome}</span>
                  <span className="text-xs text-fg-3">{m.qtd} unidades</span>
                </span>
                <span className="shrink-0 tabular-nums text-fg-2">{reais(m.valor)}</span>
              </li>
            ))}
          </ol>
        </Painel>
      </div>
    </>
  );
}
