"use client";

import { CUPONS, dataBr, reais } from "@/content/painel-mock";
import { Botao, Painel, Selo, TituloSecao } from "./ui";

export function CuponsTab() {
  return (
    <>
      <TituloSecao
        titulo="Cupons de desconto"
        apoio={`${CUPONS.filter((c) => c.ativo).length} ativos de ${CUPONS.length} cadastrados`}
        acao={<Botao tom="forte">+ Novo cupom</Botao>}
      />

      <Painel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[0.68rem] uppercase tracking-[0.12em] text-fg-3">
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 text-right font-semibold">Desconto</th>
                <th className="px-4 py-3 font-semibold">Validade</th>
                <th className="px-4 py-3 text-right font-semibold">Usos</th>
                <th className="px-4 py-3 font-semibold">Situação</th>
              </tr>
            </thead>
            <tbody>
              {CUPONS.map((c) => (
                <tr key={c.codigo} className="border-b border-line/60 transition-colors last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-fg">{c.codigo}</td>
                  <td className="px-4 py-3 text-fg-2">
                    {c.tipo === "percentual" ? "Percentual" : "Valor fixo"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-fg">
                    {c.tipo === "percentual" ? `${c.valor}%` : reais(c.valor)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-fg-2">{dataBr(c.validade)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-fg-2">
                    {c.usos} de {c.limite}
                  </td>
                  <td className="px-4 py-3">
                    {c.ativo ? <Selo tom="ok">Ativo</Selo> : <Selo tom="neutro">Expirado</Selo>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Painel>
    </>
  );
}
