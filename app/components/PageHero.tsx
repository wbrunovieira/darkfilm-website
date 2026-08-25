"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
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

export function PageHero({ eyebrow, title, intro, image, imagePosition = "center", compact }: Props) {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section className={`relative isolate overflow-hidden grain ${compact ? "pt-32 pb-14 md:pt-44 md:pb-20" : "pt-36 pb-20 md:pt-52 md:pb-28"}`}>
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="photo object-cover opacity-60"
            style={{ objectPosition: imagePosition }}
          />
          <div className="tint-overlay" />
        </div>
      )}
      {!image && (
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_80%_0%,rgba(209,20,31,0.16),transparent)]" />
      )}
      <div className="container-x">
        <motion.p {...fade(0.1)} className="eyebrow mb-5">
          {eyebrow}
        </motion.p>
        <motion.h1 {...fade(0.2)} className="display max-w-4xl text-[clamp(2.75rem,8vw,6.5rem)]">
          {title}
        </motion.h1>
        {intro && (
          <motion.div {...fade(0.35)} className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-2 md:text-xl">
            {intro}
          </motion.div>
        )}
      </div>
    </section>
  );
}
