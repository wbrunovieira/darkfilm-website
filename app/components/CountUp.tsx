"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Anima um número de 0 até o valor final quando entra na tela.
 * Aceita strings como "1992", "34", "79%", "17×", "FPS 1.000+", "3M", "4,6":
 * o trecho numérico é animado, prefixo e sufixo são mantidos. Ponto é
 * separador de milhar; vírgula, decimal (formatação pt-BR).
 *
 * O estado inicial é sempre 0 no servidor e no cliente (sem ramificar por
 * prefers-reduced-motion na renderização), evitando mismatch de hidratação;
 * quem prefere menos movimento recebe o valor final logo após a montagem.
 */
export function CountUp({
  value,
  duration = 1.6,
  delay = 0,
}: {
  value: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  const m = value.match(/^(\D*?)(\d[\d.]*)(?:,(\d+))?(.*)$/);
  const prefix = m?.[1] ?? "";
  const suffix = m?.[4] ?? "";
  const decimals = m?.[3]?.length ?? 0;
  const hasThousandsDot = !!m && m[2].includes(".");
  const target = m ? Number(m[2].replace(/\./g, "") + (m[3] ? `.${m[3]}` : "")) : NaN;

  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || Number.isNaN(target)) return;
    // Com reduced-motion a "animação" dura 0s: cai direto no valor final.
    const controls = animate(0, target, {
      duration: reduce ? 0 : duration,
      delay: reduce ? 0 : delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, reduce, target, duration, delay]);

  if (!m) return <span ref={ref}>{value}</span>;

  const text =
    hasThousandsDot || decimals > 0
      ? n.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : String(Math.round(n));

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
