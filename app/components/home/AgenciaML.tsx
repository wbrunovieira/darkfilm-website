import Image from "next/image";
import Link from "next/link";
import { Reveal } from "../Reveal";
import { ArrowIcon } from "../icons";
import { CHAMADA } from "@/content/mercado-livre";

/**
 * Destaque da Agência Mercado Livre na home.
 *
 * Pedido do cliente em 12/09/2026, com o texto pronto. O botão leva para a página que detalha
 * envio, retirada, devolução e troca.
 *
 * O amarelo do Mercado Livre é a cor mais forte que entra neste site, que é escuro e vermelho.
 * Por isso ele aparece só no logo e num fio: puxar o amarelo para fundo ou para botão faria esta
 * seção gritar mais alto que a marca do próprio cliente, numa página que é dele.
 */
export function AgenciaML() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-bg-2">
      {/* Brilho amarelo bem contido, só para a seção não ficar igual às vizinhas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,224,0,0.09),transparent_70%)] blur-2xl"
      />

      <div className="container-x relative grid items-center gap-8 py-16 md:grid-cols-[1fr_auto] md:gap-14 md:py-20">
        <Reveal>
          <Image
            src="/img/marcas/mercado-livre.png"
            alt="Mercado Livre"
            width={288}
            height={72}
            className="h-9 w-auto md:h-11"
          />

          <h2 className="display mt-5 text-3xl md:text-5xl">{CHAMADA.titulo}</h2>
          <p className="mt-3 text-lg text-fg-2">{CHAMADA.linha}</p>

          <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            {CHAMADA.servicos.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="size-1 rounded-full bg-gold/60" />}
                <span className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-fg">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <Link
            href="/agencia-mercado-livre"
            className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-line-strong px-7 font-display text-sm font-semibold uppercase tracking-[0.14em] transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold"
          >
            {CHAMADA.botao}
            <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
