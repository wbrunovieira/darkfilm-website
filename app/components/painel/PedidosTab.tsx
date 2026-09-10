"use client";

import { useState } from "react";
import { PEDIDOS, dataBr, reais, totalPedido, type Pedido } from "@/content/painel-mock";
import { Painel, Selo, TituloSecao } from "./ui";

const SELO_PAGAMENTO = {
  pago: { tom: "ok", texto: "Pago" },
  aguardando: { tom: "espera", texto: "Aguardando" },
  cancelado: { tom: "ruim", texto: "Cancelado" },
} as const;

const SELO_ENVIO = {
  separando: { tom: "espera", texto: "Separando" },
  enviado: { tom: "ok", texto: "Enviado" },
  entregue: { tom: "neutro", texto: "Entregue" },
  cancelado: { tom: "ruim", texto: "Cancelado" },
} as const;

export function PedidosTab() {
  const [aberto, setAberto] = useState<Pedido | null>(null);

  return (
    <>
      <TituloSecao titulo="Pedidos" apoio={`${PEDIDOS.length} pedidos nos últimos sete dias`} />

      <Painel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[0.68rem] uppercase tracking-[0.12em] text-fg-3">
                <th className="px-4 py-3 font-semibold">Pedido</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 text-right font-semibold">Valor</th>
                <th className="px-4 py-3 font-semibold">Pagamento</th>
                <th className="px-4 py-3 font-semibold">Envio</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {PEDIDOS.map((p) => (
                <tr
                  key={p.numero}
                  onClick={() => setAberto(p)}
                  className="cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 font-mono text-xs text-fg-2">#{p.numero}</td>
                  <td className="px-4 py-3">
                    <span className="block font-medium text-fg">{p.cliente}</span>
                    <span className="text-xs text-fg-3">{p.cidade}</span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-fg-2">{dataBr(p.data)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{reais(totalPedido(p))}</td>
                  <td className="px-4 py-3">
                    <Selo tom={SELO_PAGAMENTO[p.pagamento].tom}>{SELO_PAGAMENTO[p.pagamento].texto}</Selo>
                  </td>
                  <td className="px-4 py-3">
                    <Selo tom={SELO_ENVIO[p.envio].tom}>{SELO_ENVIO[p.envio].texto}</Selo>
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-semibold text-fg-3">Ver</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Painel>

      {aberto && <DetalhePedido p={aberto} onFechar={() => setAberto(null)} />}
    </>
  );
}

function DetalhePedido({ p, onFechar }: { p: Pedido; onFechar: () => void }) {
  const subtotal = p.itens.reduce((s, i) => s + i.qtd * i.preco, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onFechar}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-line bg-bg-2"
        aria-label={`Pedido ${p.numero}`}
      >
        <header className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-bg-2 px-6 py-5">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.16em] text-fg-3">Pedido #{p.numero}</p>
            <h3 className="display mt-1 text-2xl">{p.cliente}</h3>
            <p className="mt-1 text-sm text-fg-3">{dataBr(p.data)}, {p.cidade}</p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg p-2 text-fg-3 transition-colors hover:bg-white/5 hover:text-fg"
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="space-y-6 px-6 py-6">
          <div className="flex flex-wrap gap-2">
            <Selo tom={SELO_PAGAMENTO[p.pagamento].tom}>Pagamento: {SELO_PAGAMENTO[p.pagamento].texto}</Selo>
            <Selo tom={SELO_ENVIO[p.envio].tom}>Envio: {SELO_ENVIO[p.envio].texto}</Selo>
            {p.notaFiscal && <Selo tom="ok">Nota fiscal emitida</Selo>}
          </div>

          <section>
            <h4 className="mb-3 font-display text-xs uppercase tracking-[0.14em] text-fg-3">Itens</h4>
            <ul className="space-y-2.5">
              {p.itens.map((i, n) => (
                <li key={n} className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-2.5 text-sm last:border-0">
                  <span>
                    <span className="block text-fg">{i.nome}</span>
                    <span className="text-xs text-fg-3">
                      {i.variacao ? `${i.variacao}, ` : ""}quantidade {i.qtd}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums">{reais(i.qtd * i.preco)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 text-sm">
              <Linha rotulo="Subtotal" valor={reais(subtotal)} />
              <Linha rotulo={`Frete, ${p.transportadora}`} valor={p.frete ? reais(p.frete) : "Grátis"} />
              <div className="flex justify-between border-t border-line pt-2 font-display text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{reais(totalPedido(p))}</span>
              </div>
            </dl>
          </section>

          <section>
            <h4 className="mb-2 font-display text-xs uppercase tracking-[0.14em] text-fg-3">Entrega</h4>
            <p className="text-sm leading-relaxed text-fg-2">{p.endereco}</p>
            {p.rastreio && (
              <p className="mt-2 text-sm">
                <span className="text-fg-3">Rastreio: </span>
                <span className="font-mono text-fg">{p.rastreio}</span>
              </p>
            )}
          </section>

          <section>
            <h4 className="mb-2 font-display text-xs uppercase tracking-[0.14em] text-fg-3">Pagamento</h4>
            <p className="text-sm text-fg-2">{p.metodoPagamento}</p>
            {p.notaFiscal && (
              <p className="mt-2 text-sm">
                <span className="text-fg-3">Nota fiscal: </span>
                <span className="font-mono text-fg">{p.notaFiscal}</span>
                <span className="ml-2 cursor-default text-red-2 underline underline-offset-4">baixar DANFE</span>
              </p>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-fg-3">{rotulo}</dt>
      <dd className="tabular-nums text-fg-2">{valor}</dd>
    </div>
  );
}
