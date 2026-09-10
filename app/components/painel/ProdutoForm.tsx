"use client";

import Image from "next/image";
import { CATALOGO, VARIACOES, reais } from "@/content/painel-mock";
import { BlocoRecolhivel, Botao, Campo, Painel, TituloSecao } from "./ui";

/**
 * Cadastro e edição de produto.
 *
 * É a tela que responde a pergunta do lojista sobre variações: a grade mostra que cada
 * combinação de cor e tamanho tem estoque, preço e código próprios. Peso e dimensões aparecem
 * como obrigatórios porque é deles que sai o cálculo de frete quando o pedido tem vários itens.
 */
export function ProdutoForm({ id, onVoltar }: { id: string; onVoltar: () => void }) {
  const p = CATALOGO.find((x) => x.id === id) ?? CATALOGO[0];
  const variacoes = p.temVariacoes ? VARIACOES.filter((v) => p.nome.includes(v.cor)) : [];

  return (
    <>
      <TituloSecao
        titulo={p.nome}
        apoio={`Código ${p.codigo}. Última alteração em 09/09/2026.`}
        acao={
          <span className="flex gap-2">
            <Botao tom="leve" onClick={onVoltar}>Voltar</Botao>
            <Botao tom="forte">Salvar produto</Botao>
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          {/* Dados básicos */}
          <Painel className="p-5">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.12em]">Dados do produto</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo rotulo="Nome" valor={p.nome} obrigatorio largura="sm:col-span-2" />
              <Campo rotulo="Descrição" valor="Camiseta de algodão com a estampa da marca no peito. Modelagem unissex." tipo="area" largura="sm:col-span-2" />
              <Campo rotulo="Categoria" valor={p.categoria} tipo="select" opcoes={["Vestuário", "Canecas", "Acessórios"]} obrigatorio />
              <Campo rotulo="Marca" valor={p.marca} tipo="select" opcoes={["The Dark Film", "Philips", "Moura", "Borcol", "Regency", "Race Chrome", "Diversos"]} />
              <Campo rotulo="Código interno" valor={p.codigo} obrigatorio />
              <Campo rotulo="Situação" valor={p.status === "ativo" ? "Ativo na loja" : "Inativo"} tipo="select" opcoes={["Ativo na loja", "Inativo"]} />
            </div>
          </Painel>

          {/* Preço */}
          <Painel className="p-5">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.12em]">Preço e promoção</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <Campo rotulo="Preço de venda" valor={reais(p.preco)} obrigatorio />
              <Campo rotulo="Preço cheio" valor={p.precoDe ? reais(p.precoDe) : ""} apoio="Aparece riscado ao lado do preço." />
              <Campo rotulo="Parcelamento máximo" valor="6x sem juros" tipo="select" opcoes={["1x", "3x sem juros", "6x sem juros", "12x"]} />
            </div>
            <label className="mt-4 flex items-center gap-2.5 text-sm text-fg-2">
              <input type="checkbox" defaultChecked={Boolean(p.precoDe)} className="size-4 accent-[var(--red)]" />
              Mostrar selo de promoção na vitrine
            </label>
          </Painel>

          {/* Variações: o ponto da tela */}
          {variacoes.length > 0 && (
            <Painel className="p-5">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em]">Variações</h3>
                <Botao>+ Adicionar variação</Botao>
              </div>
              <p className="mb-4 text-xs text-fg-3">
                Cada combinação tem o seu estoque, o seu preço e o seu código. A loja mostra apenas
                as combinações com estoque disponível.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-[0.66rem] uppercase tracking-[0.1em] text-fg-3">
                      <th className="py-2.5 pr-3 font-semibold">Cor</th>
                      <th className="px-3 py-2.5 font-semibold">Tamanho</th>
                      <th className="px-3 py-2.5 font-semibold">Código</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Estoque</th>
                      <th className="py-2.5 pl-3 text-right font-semibold">Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variacoes.map((v) => (
                      <tr key={v.codigo} className="border-b border-line/60 last:border-0">
                        <td className="py-2.5 pr-3">
                          <span className="flex items-center gap-2">
                            <span className={`size-3.5 rounded-full ring-1 ring-white/20 ${v.cor === "Preta" ? "bg-[#1c1d21]" : "bg-[#f2f0ec]"}`} />
                            {v.cor}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-fg-2">{v.tamanho}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-fg-3">{v.codigo}</td>
                        <td className="px-3 py-2.5 text-right">
                          <input
                            defaultValue={v.estoque}
                            className="w-16 rounded-md border border-line bg-bg-3 px-2 py-1 text-right text-sm tabular-nums outline-none focus:border-red/60"
                          />
                        </td>
                        <td className="py-2.5 pl-3 text-right">
                          <input
                            defaultValue={reais(v.preco)}
                            className="w-24 rounded-md border border-line bg-bg-3 px-2 py-1 text-right text-sm tabular-nums outline-none focus:border-red/60"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Painel>
          )}

          {/* Peso e dimensões */}
          <Painel className="p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em]">Peso e dimensões</h3>
            <p className="mb-4 mt-1 text-xs text-fg-3">
              Obrigatórios. É a partir deles que o frete é calculado, inclusive quando o pedido
              leva vários produtos na mesma caixa.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Campo rotulo="Peso (kg)" valor="0,180" obrigatorio />
              <Campo rotulo="Altura (cm)" valor="2" obrigatorio />
              <Campo rotulo="Largura (cm)" valor="30" obrigatorio />
              <Campo rotulo="Comprimento (cm)" valor="40" obrigatorio />
            </div>
          </Painel>

          <BlocoRecolhivel
            titulo="Dados fiscais"
            apoio="Preenchidos uma vez por produto, usados na emissão da nota."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Campo rotulo="NCM" valor="6109.10.00" />
              <Campo rotulo="CFOP" valor="5102" />
              <Campo rotulo="Origem" valor="0, Nacional" tipo="select" opcoes={["0, Nacional", "1, Importação direta", "2, Mercado interno"]} />
              <Campo rotulo="Unidade" valor="UN" tipo="select" opcoes={["UN", "PC", "KG", "CX"]} />
            </div>
          </BlocoRecolhivel>

          <BlocoRecolhivel titulo="Busca no Google" apoio="Como o produto aparece nos resultados.">
            <div className="grid gap-4">
              <Campo rotulo="Título" valor="Camiseta The Dark Film Preta, algodão" apoio="Recomendado até 60 caracteres." />
              <Campo rotulo="Descrição" valor="Camiseta preta de algodão com a estampa The Dark Film. Tamanhos P ao GG, envio para todo o Brasil." tipo="area" apoio="Recomendado até 160 caracteres." />
            </div>
          </BlocoRecolhivel>
        </div>

        {/* Coluna da direita */}
        <div className="space-y-4">
          <Painel className="p-5">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.12em]">Fotos</h3>
            <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-bg-3">
              <Image src={p.img} alt="" fill sizes="320px" className="object-cover" />
              <span className="absolute left-2 top-2 rounded bg-bg/85 px-2 py-1 text-[0.65rem] font-semibold text-fg-2 backdrop-blur">
                Foto principal
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {CATALOGO.slice(1, 3).map((o) => (
                <div key={o.id} className="relative aspect-square overflow-hidden rounded-lg border border-line bg-bg-3">
                  <Image src={o.img} alt="" fill sizes="100px" className="object-cover opacity-70" />
                </div>
              ))}
              <button
                type="button"
                className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-line-strong text-2xl text-fg-3 transition-colors hover:border-red hover:text-red-2"
                aria-label="Adicionar foto"
              >
                +
              </button>
            </div>
          </Painel>

          <Painel className="p-5">
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.12em]">Resumo</h3>
            <dl className="space-y-2.5 text-sm">
              {[
                ["Estoque total", String(p.temVariacoes ? variacoes.reduce((s, v) => s + v.estoque, 0) : p.estoque)],
                ["Variações", String(variacoes.length || "sem variação")],
                ["Vendidos no mês", "42"],
                ["Visitas no mês", "310"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-2 last:border-0">
                  <dt className="text-fg-3">{k}</dt>
                  <dd className="tabular-nums text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </Painel>
        </div>
      </div>
    </>
  );
}
