"use client";

import { motion, type Variants } from "motion/react";
import type { ComponentProps } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

type Props = ComponentProps<typeof motion.div> & {
  delay?: number;
  once?: boolean;
};

// `prefers-reduced-motion` é tratado globalmente em <MotionProvider> (MotionConfig),
// por isso `initial` é sempre "hidden": mesmo HTML no servidor e no cliente.

/** Revela o conteúdo ao entrar no viewport. */
export function Reveal({ delay = 0, once = true, children, ...rest }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Contêiner que aplica stagger nos filhos `<RevealItem>`. */
export function RevealGroup({
  stagger = 0.08,
  children,
  ...rest
}: ComponentProps<typeof motion.div> & { stagger?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: stagger }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem(props: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      variants={variants}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    />
  );
}
