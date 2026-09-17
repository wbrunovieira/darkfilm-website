import Image from "next/image";
import Link from "next/link";
import { Reveal } from "../Reveal";
import { ArrowIcon } from "../icons";
import { CHAMADA } from "@/content/thule";

/**
 * Destaque da revenda Thule na home.
 *
 * Pedido do cliente em 17/09/2026. O botão leva para a página que detalha as três linhas e a
 * consulta de compatibilidade.
 *
 * Fica logo depois da Agência Mercado Livre: as credenciais do topo e os blocos da home passam a
 * contar a mesma história na mesma ordem — 3M, Mercado Livre, Thule.
 */
export function Thule() {
  return (
    <section
      id="thule"
      className="relative scroll-mt-24 overflow-hidden border-b border-line bg-bg"
      aria-labelledby="thule-titulo"
    >
      <div className="container-x grid items-center gap-8 py-16 md:grid-cols-[1fr_auto] md:gap-14 md:py-20">
        <Reveal>
          <Image
            src="/img/marcas/thule.svg"
            alt="Thule"
            width={155}
            height={40}
            className="h-7 w-auto md:h-9"
          />

          <h2 id="thule-titulo" className="display mt-5 text-3xl md:text-5xl">
            {CHAMADA.titulo}
          </h2>

          <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            {CHAMADA.itens.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="size-1 rounded-full bg-fg-3" />}
                <span className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-fg">
                  {s}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-fg-2">{CHAMADA.linha}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <Link
            href="/thule"
            className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-line-strong px-7 font-display text-sm font-semibold uppercase tracking-[0.14em] transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-fg hover:text-fg"
          >
            {CHAMADA.botao}
            <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
