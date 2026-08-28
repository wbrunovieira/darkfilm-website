"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  eyebrow: string;
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
export function PageHero({ eyebrow, title, intro, image, imagePosition = "center", compact }: Props) {
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
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="eyebrow mb-5"
          >
            {eyebrow}
          </motion.p>
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
