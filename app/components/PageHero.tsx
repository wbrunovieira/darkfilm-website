"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export type Crumb = { label: string; href?: string };

type Props = {
  /**
   * Identidade da página: o mesmo rótulo do menu, e o pai quando existir.
   *
   * Existe porque nenhuma das páginas internas tinha H1 igual ao item de menu clicado —
   * clicava-se em "A Empresa" e o título dizia "A mais experiente e reconhecida da região".
   * O elo entre o clique e a chegada era um texto de 12px, vermelho sobre foto escura, que
   * ninguém lia. Num site todo escuro com foto sangrada e H1 enorme, isso fazia cada página
   * parecer a mesma página com outra frase — a causa nº 1 medida do "me perco navegando".
   *
   * O slogan continua sendo o H1: é ele que dá o tom do site. Quem mudou de peso foi o rótulo.
   */
  crumbs: Crumb[];
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  imagePosition?: string;
  compact?: boolean;
};

/**
 * Hero das páginas internas. Mesma API de sempre; o que mudou é a atmosfera:
 * gradientes em camadas (brasa vermelha, vinheta, sheen de película), réguas
 * verticais discretas, um traço vertical que cresce ao lado do eyebrow e uma
 * linha de base que se desenha. O reveal usa blur→nítido no título, como
 * uma película saindo do foco. `initial` é estático (sem useReducedMotion):
 * o MotionConfig global cuida do prefers-reduced-motion.
 */
export function PageHero({ crumbs, title, intro, image, imagePosition = "center", compact }: Props) {
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 28, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section
      className={`relative isolate overflow-hidden grain ${
        compact ? "pt-32 pb-14 md:pt-44 md:pb-20" : "pt-36 pb-20 md:pt-52 md:pb-28"
      }`}
    >
      {image ? (
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease }}
          >
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="photo object-cover opacity-70"
              style={{ objectPosition: imagePosition }}
            />
          </motion.div>
          <div className="hero-atmo-photo" />
        </div>
      ) : (
        <div aria-hidden className="hero-atmo" />
      )}
      <div aria-hidden className="hero-rules" />

      <div className="container-x">
        <div className="relative pl-5 md:pl-7">
          {/* traço vertical que cresce ao lado do eyebrow */}
          <motion.span
            aria-hidden
            className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-red via-line-strong to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.1, delay: 0.05, ease }}
          />
          <motion.nav
            aria-label="Você está em"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="hero-crumbs mb-5"
          >
            {crumbs.map((c, i) => (
              <span key={c.label} className="contents">
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? (
                  <Link href={c.href}>{c.label}</Link>
                ) : (
                  <span aria-current="page">{c.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
          <motion.h1
            {...rise(0.25)}
            className="display max-w-4xl text-[clamp(2.75rem,8vw,6.5rem)] [text-wrap:balance]"
          >
            {title}
          </motion.h1>
          {intro && (
            <motion.div
              {...rise(0.45)}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-2 md:text-xl"
            >
              {intro}
            </motion.div>
          )}
        </div>
      </div>

      <motion.span
        aria-hidden
        className="hero-baseline"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.35, ease }}
      />
    </section>
  );
}
