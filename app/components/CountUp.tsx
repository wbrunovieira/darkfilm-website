"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Anima um número de 0 até o valor final quando entra na tela.
 * Aceita strings como "1992", "34", "79%", "17×", "FPS 1.000+", "3M":
 * o trecho numérico é animado, prefixo e sufixo são mantidos.
 */
export function CountUp({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  const m = value.match(/^(\D*)([\d.]+)(.*)$/);
  const prefix = m?.[1] ?? "";
  const suffix = m?.[3] ?? "";
  const hasThousandsDot = !!m && m[2].includes(".");
  const target = m ? Number(m[2].replace(/\./g, "")) : NaN;

  const [n, setN] = useState(reduce || Number.isNaN(target) ? target : 0);

  useEffect(() => {
    if (!inView || reduce || Number.isNaN(target)) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, target, duration]);

  if (!m) return <span ref={ref}>{value}</span>;

  const shown = reduce ? target : n;
  const text = hasThousandsDot ? shown.toLocaleString("pt-BR") : String(shown);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
