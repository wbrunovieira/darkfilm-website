"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { site, whatsappUrl, yearsInBusiness } from "@/lib/site";
import { ArrowIcon, WhatsAppIcon } from "../icons";
import { GoogleBadge } from "../GoogleBadge";

const ease = [0.16, 1, 0.3, 1] as const;

/** Placas da parede da loja (asset do site original), reinterpretadas como detalhe de
 *  ambiente e não como elemento de layout: pequenas, dessaturadas, "penduradas" logo
 *  abaixo do header e com fade na base (esconde a placa do cachorro, que ruía o tom).
 *  Ficam fora da coluna de texto em qualquer largura. */
function Placas() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -80]);

  return (
    <motion.div
      aria-hidden
      style={{ y }}
      className="pointer-events-none absolute right-0 top-14 z-0 w-[34vw] max-w-[150px] md:top-[5.5rem] md:w-[18vw] md:max-w-[230px] lg:right-4 xl:max-w-[260px]"
    >
      <motion.div
        initial={{ opacity: 0, y: -24, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.4, delay: 0.6, ease }}
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, #000 50%, transparent 82%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 50%, transparent 82%)",
        }}
      >
        <Image
          src="/img/marca/placas-topo.png"
          alt=""
          width={472}
          height={439}
          priority
          className="h-auto w-full opacity-50 saturate-[0.55] brightness-[0.85] drop-shadow-[0_24px_30px_rgba(0,0,0,0.7)] md:opacity-60"
        />
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden grain">
      {/* Foto de fundo: Kombi da The Dark Film dentro da oficina (álbum de eventos, 2014).
          Reposicionada à direita para que o texto assente sobre a parte mais escura da
          oficina, e não sobre o mosaico. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/hero/oficina-kombi.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="photo-hero object-cover object-[78%_60%] animate-slow-zoom"
        />
        <div className="tint-overlay-hero" />
      </div>

      <Placas />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:pb-20 md:pt-32 short:pb-12 short:pt-24">
        <motion.p {...fade(0.3)} className="eyebrow mb-4 md:mb-5 short:mb-3">
          {site.city}/{site.state} · desde {site.founded}
        </motion.p>

        <h1 className="display max-w-5xl text-[clamp(2.75rem,min(9.5vw,14vh),8rem)] short:text-[clamp(2.5rem,min(8.5vw,12vh),6rem)] text-fg">
          <motion.span {...fade(0.4)} className="block">
            Película, som
          </motion.span>
          <motion.span {...fade(0.5)} className="block">
            e acessórios com
          </motion.span>
          <motion.span {...fade(0.6)} className="block">
            {yearsInBusiness()} anos de estrada.
          </motion.span>
        </h1>

        <motion.p
          {...fade(0.75)}
          className="mt-6 max-w-lg text-base leading-relaxed text-fg-2 md:mt-8 md:text-lg short:mt-4 short:max-w-xl short:text-base"
        >
          Somente film de linha profissional, com proteção anti-risco e encolhimento térmico
          sem emendas — mesmo em vidros boleados. Aplicadora credenciada{" "}
          <strong className="text-fg">3M</strong>.
        </motion.p>

        <motion.div {...fade(0.9)} className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 md:mt-10 short:mt-5">
          <a
            href={whatsappUrl("Olá! Gostaria de um orçamento de película.")}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-red px-7 py-4 font-display text-lg font-semibold uppercase tracking-[0.14em] text-white transition-[background-color,transform] duration-300 hover:bg-red-2 hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="size-5" />
            Pedir orçamento
          </a>
          <Link
            href="/linha-automotiva"
            className="group inline-flex items-center gap-3 px-2 py-4 font-display text-lg font-medium uppercase tracking-[0.14em] text-fg-2 transition-colors hover:text-fg"
          >
            Conhecer as películas
            <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div {...fade(1.05)} className="mt-8 md:mt-10 short:mt-4">
          <GoogleBadge variant="hero" />
        </motion.div>
      </div>
    </section>
  );
}
