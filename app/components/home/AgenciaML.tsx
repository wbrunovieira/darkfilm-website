"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "../Reveal";
import { ABERTURA, CHAMADA, IMPORTANTE, PASSOS } from "@/content/mercado-livre";
import {
  AvisoIcon,
  DevolucaoIcon,
  EnvioIcon,
  RetiradaIcon,
  TrocaIcon,
} from "../icons/mercadolivre";

/**
 * Agência Mercado Livre na home.
 *
 * Pedido do cliente em 12/09/2026, com o texto pronto. Ele escreveu "ao clicar, abrir uma seção",
 * e é literalmente isso: o destaque fica sempre visível e o detalhe abre no lugar. Chegou a
 * existir como página própria; virou seção porque o projeto já tem 55 páginas e não precisa de
 * mais uma para quatro parágrafos.
 *
 * Abrir no lugar, em vez de rolar para um bloco mais abaixo, mantém a home curta: quem só quer
 * saber que a loja é agência lê três linhas e segue.
 *
 * O detalhe fica SEMPRE no documento, só recolhido por altura. Se fosse montado apenas ao clicar,
 * o texto que ele escreveu não entraria no HTML, e nem o Google nem um leitor de tela veriam
 * "Agência Mercado Livre", "QR Code" ou "retirada de compras". Conteúdo de verdade não pode
 * depender de clique para existir.
 *
 * O amarelo do Mercado Livre é a cor mais forte que entra neste site, que é escuro e vermelho.
 * Por isso aparece só no logo e nos fios: puxá-lo para fundo ou botão faria esta seção gritar
 * mais alto que a marca do próprio cliente.
 */

const ICONE = {
  envio: EnvioIcon,
  retirada: RetiradaIcon,
  devolucao: DevolucaoIcon,
  troca: TrocaIcon,
} as const;

export function AgenciaML() {
  const [aberto, setAberto] = useState(false);

  return (
    <section
      id="agencia-mercado-livre"
      className="relative scroll-mt-24 overflow-hidden border-y border-line bg-bg-2"
      aria-labelledby="aml-titulo"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,224,0,0.08),transparent_70%)] blur-2xl"
      />

      <div className="container-x relative py-16 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-14">
          <Reveal>
            <Image
              src="/img/marcas/mercado-livre.png"
              alt="Mercado Livre"
              width={288}
              height={72}
              className="h-9 w-auto md:h-11"
            />

            <h2 id="aml-titulo" className="display mt-5 text-3xl md:text-5xl">
              {CHAMADA.titulo}
            </h2>
            <p className="mt-3 text-lg text-fg-2">{CHAMADA.linha}</p>

            <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              {CHAMADA.servicos.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="size-1 rounded-full bg-gold/60"
                    />
                  )}
                  <span className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-fg">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-controls="aml-detalhe"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-line-strong px-7 font-display text-sm font-semibold uppercase tracking-[0.14em] transition-[border-color,color] duration-300 hover:border-gold hover:text-gold"
            >
              {aberto ? "Fechar" : CHAMADA.botao}
              <svg
                viewBox="0 0 24 24"
                className={`size-5 transition-transform duration-300 ${aberto ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  d="m6 9 6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Reveal>
        </div>

        <motion.div
          id="aml-detalhe"
          initial={false}
          animate={{ height: aberto ? "auto" : 0, opacity: aberto ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
          aria-hidden={!aberto}
        >
          <div className="mt-10 border-t border-line pt-10">
            <h3 className="display text-2xl md:text-4xl">{ABERTURA.titulo}</h3>
            <p className="mt-3 max-w-3xl text-fg-2">{ABERTURA.texto}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {PASSOS.map((p) => {
                const Icone = ICONE[p.id as keyof typeof ICONE];
                return (
                  <article
                    key={p.id}
                    className="flex h-full gap-4 rounded-xl border border-line bg-bg-3 p-6"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-bg-2 text-gold">
                      <Icone />
                    </span>
                    <div>
                      <h4 className="font-display text-lg font-semibold uppercase leading-tight">
                        {p.titulo}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-fg-2">
                        {p.texto}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Delimita o papel da loja e o da plataforma. Discreto no peso, nunca escondido:
                    foi escrito por ele com esse cuidado. */}
            <aside className="mt-4 rounded-xl border border-line-strong bg-bg-3 p-6 md:p-8">
              <p className="flex items-center gap-2.5 font-display text-sm font-semibold uppercase tracking-[0.16em] text-fg">
                <AvisoIcon className="size-5 text-red-2" />
                {IMPORTANTE.titulo}
              </p>
              {IMPORTANTE.paragrafos.map((t) => (
                <p
                  key={t.slice(0, 24)}
                  className="mt-3 text-sm leading-relaxed text-fg-2"
                >
                  {t}
                </p>
              ))}
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
