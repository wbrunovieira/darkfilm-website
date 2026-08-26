"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { site, whatsappUrl, yearsInBusiness } from "@/lib/site";
import { ArrowIcon, WhatsAppIcon } from "../icons";
import { GoogleBadge } from "../GoogleBadge";

const ease = [0.16, 1, 0.3, 1] as const;

/** Placas da parede da loja (assets do site original), reinterpretadas: escurecidas,
 *  em parallax leve, e só nos cantos — não espalhadas pela tela. */
function Placas() {
  const { scrollY } = useScroll();
  const yTopo = useTransform(scrollY, [0, 800], [0, -120]);
  const enter = (delay: number, x: number, rot: number) => ({
    initial: { opacity: 0, x, rotate: rot },
    animate: { opacity: 1, x: 0, rotate: 0 },
    transition: { duration: 1.4, delay, ease },
  });

  return (
    <>
      <motion.div
        aria-hidden
        style={{ y: yTopo }}
        className="pointer-events-none absolute -right-6 top-14 z-0 w-[46vw] max-w-[330px] md:-right-2 md:top-20 md:w-[30vw] md:max-w-[440px]"
      >
        <motion.div {...enter(0.5, 60, 6)}>
          <Image
            src="/img/marca/placas-topo.png"
            alt=""
            width={472}
            height={439}
            priority
            className="h-auto w-full opacity-70 saturate-[0.8] contrast-[1.05] drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)] md:opacity-85"
          />
        </motion.div>
      </motion.div>

    </>
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
      {/* Foto de fundo: Kombi da The Dark Film dentro da oficina (álbum de eventos, 2014). */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/hero/oficina-kombi.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="photo object-cover object-[70%_45%] animate-slow-zoom"
        />
        <div className="tint-overlay" />
        {/* faixa vermelha: a "película" descendo sobre o vidro */}
        <motion.div
          aria-hidden
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.4, ease, delay: 0.2 }}
          className="absolute left-5 top-0 h-full w-px origin-top bg-gradient-to-b from-red via-red/60 to-transparent sm:left-8 lg:left-12"
        />
      </div>

      <Placas />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-32 md:pb-24">
        <motion.p {...fade(0.3)} className="eyebrow mb-5">
          {site.city}/{site.state} · desde {site.founded}
        </motion.p>

        <h1 className="display max-w-5xl text-[clamp(3rem,10vw,8.5rem)] text-fg">
          <motion.span {...fade(0.4)} className="block">
            Película, som
          </motion.span>
          <motion.span {...fade(0.5)} className="block">
            e acessórios <span className="text-red-2">com</span>
          </motion.span>
          <motion.span {...fade(0.6)} className="block">
            {yearsInBusiness()} anos de estrada.
          </motion.span>
        </h1>

        <motion.p
          {...fade(0.75)}
          className="mt-8 max-w-xl text-lg leading-relaxed text-fg-2 md:text-xl"
        >
          Utilizamos somente film de linha profissional, com proteção anti-risco e técnica
          avançada de encolhimento térmico — sem emendas mesmo em vidros mais boleados.
          Aplicadora credenciada <strong className="text-fg">3M</strong>.
        </motion.p>

        <motion.div {...fade(0.9)} className="mt-10 flex flex-wrap items-center gap-4">
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

        <motion.div {...fade(1.05)} className="mt-8">
          <GoogleBadge variant="hero" />
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        {...fade(1.2)}
        className="pointer-events-none absolute bottom-6 right-6 hidden items-center gap-3 font-display text-xs uppercase tracking-[0.3em] text-fg-3 md:flex"
      >
        Role
        <span className="block h-px w-12 bg-fg-3" />
      </motion.div>
    </section>
  );
}
