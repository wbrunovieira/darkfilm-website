"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"`: o motion desliga transform/layout animations quando o usuário
 * prefere menos movimento, mantendo só opacidade. Evita o mismatch de hidratação que
 * `useReducedMotion()` causa em `initial` renderizado no servidor.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
