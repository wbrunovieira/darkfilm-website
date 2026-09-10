"use client";

import Image from "next/image";
import { useState } from "react";
import { ProdutosTab } from "./ProdutosTab";
import { ProdutoForm } from "./ProdutoForm";
import { PedidosTab } from "./PedidosTab";
import { VendasTab } from "./VendasTab";
import { CuponsTab } from "./CuponsTab";
import { PEDIDOS, VENDAS, reais } from "@/content/painel-mock";
import { site } from "@/lib/site";

type Aba = "produtos" | "pedidos" | "vendas" | "cupons";

const ABAS: { id: Aba; rotulo: string; icone: React.ReactNode }[] = [
  { id: "produtos", rotulo: "Produtos", icone: <IconeCaixa /> },
  { id: "pedidos", rotulo: "Pedidos", icone: <IconeLista /> },
  { id: "vendas", rotulo: "Vendas", icone: <IconeGrafico /> },
  { id: "cupons", rotulo: "Cupons", icone: <IconeEtiqueta /> },
];

/**
 * Painel administrativo da loja, em maquete.
 *
 * Nada aqui grava: não há servidor, banco nem chamada de rede. O que responde ao clique é o que
 * a apresentação precisa mostrar, trocar de aba, abrir um pedido, filtrar e buscar. Formulário é
 * de leitura.
 */
export function PainelLoja() {
  const [aba, setAba] = useState<Aba>("produtos");
  const [editando, setEditando] = useState<string | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const aguardando = PEDIDOS.filter((p) => p.pagamento === "aguardando").length;

  const irPara = (a: Aba) => {
    setAba(a);
    setEditando(null);
    setMenuAberto(false);
  };

  return (
    <div className="min-h-screen bg-bg text-fg">
      <p className="sticky top-0 z-50 bg-red px-4 py-2 text-center font-display text-[0.62rem] font-semibold uppercase leading-tight tracking-[0.12em] text-white sm:text-[0.7rem] sm:tracking-[0.16em]">
        Demonstração do painel administrativo, com dados de exemplo
      </p>

      <div className="flex">
        {/* Barra lateral */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-line bg-bg-2 pt-[38px] transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            menuAberto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center gap-3 border-b border-line px-5">
            <Image src="/img/marca/logo.png" alt={site.name} width={412} height={137} priority className="h-8 w-auto" />
            <span className="border-l border-line-strong pl-3 font-display text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.16em] text-red-2">
              Painel
              <br />
              da loja
            </span>
          </div>

          <nav className="p-3">
            {ABAS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => irPara(a.id)}
                aria-current={aba === a.id ? "page" : undefined}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  aba === a.id ? "bg-red/12 text-red-2" : "text-fg-2 hover:bg-white/5 hover:text-fg"
                }`}
              >
                <span className="shrink-0">{a.icone}</span>
                {a.rotulo}
                {a.id === "pedidos" && aguardando > 0 && (
                  <span className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-300">
                    {aguardando}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mx-3 mt-2 rounded-lg border border-line bg-bg-3 p-4">
            <p className="font-display text-[0.62rem] uppercase tracking-[0.12em] text-fg-3">Vendas hoje</p>
            <p className="display mt-1 text-xl tabular-nums">{reais(VENDAS.hoje.valor)}</p>
            <p className="mt-0.5 text-xs text-fg-3">{VENDAS.hoje.pedidos} pedidos</p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-line p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red/15 font-display text-sm font-semibold text-red-2">
                BB
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">Bruno Becker</span>
                <span className="block text-xs text-fg-3">Administrador</span>
              </span>
            </div>
          </div>
        </aside>

        {menuAberto && (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          />
        )}

        {/* Conteúdo */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-[34px] z-20 flex h-20 items-center gap-4 border-b border-line bg-bg/90 px-4 backdrop-blur md:px-8">
            <button
              type="button"
              onClick={() => setMenuAberto(true)}
              className="rounded-lg border border-line-strong p-2.5 lg:hidden"
              aria-label="Abrir menu"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>

            <div className="min-w-0">
              <p className="font-display text-[0.65rem] uppercase tracking-[0.16em] text-fg-3">
                The Dark Film e Sound, Petrópolis
              </p>
              <p className="truncate font-display text-base font-semibold uppercase">
                {editando ? "Editar produto" : ABAS.find((a) => a.id === aba)?.rotulo}
              </p>
            </div>

            <span className="ml-auto hidden items-center gap-2 rounded-full border border-line px-3.5 py-2 text-xs text-fg-3 sm:flex">
              <span className="size-2 rounded-full bg-emerald-400" />
              Loja no ar
            </span>
          </header>

          <main className="px-4 py-6 md:px-8 md:py-8">
            {aba === "produtos" &&
              (editando ? (
                <ProdutoForm id={editando} onVoltar={() => setEditando(null)} />
              ) : (
                <ProdutosTab onEditar={setEditando} />
              ))}
            {aba === "pedidos" && <PedidosTab />}
            {aba === "vendas" && <VendasTab />}
            {aba === "cupons" && <CuponsTab />}
          </main>
        </div>
      </div>
    </div>
  );
}

function IconeCaixa() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" strokeLinejoin="round" />
      <path d="m4 7.2 8 4.2 8-4.2M12 11.4V21" />
    </svg>
  );
}
function IconeLista() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" strokeLinecap="round" />
    </svg>
  );
}
function IconeGrafico() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" />
    </svg>
  );
}
function IconeEtiqueta() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M3 12.5V4h8.5l8.5 8.5-8.5 8.5L3 12.5Z" strokeLinejoin="round" />
      <circle cx="7.5" cy="8" r="1.3" />
    </svg>
  );
}
