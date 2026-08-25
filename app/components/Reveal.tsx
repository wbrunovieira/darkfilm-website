"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ComponentProps } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

type Props = ComponentProps<typeof motion.div> & {
  delay?: number;
  once?: boolean;
};

/** Revela o conteúdo ao entrar no viewport. Sem movimento se o usuário preferir. */
export function Reveal({ delay = 0, once = true, children, ...rest }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : "hidden"}
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
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : "hidden"}
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
