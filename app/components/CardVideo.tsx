"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vídeo de fundo de card: mudo, em loop, sem controles.
 *
 * Três cuidados que fazem isso valer a pena em vez de atrapalhar:
 * - só carrega quando o card chega perto da viewport (`preload="none"` + IntersectionObserver),
 *   para não pesar o carregamento de quem nem rolou até aqui;
 * - pausa quando sai da tela, para não gastar bateria no celular;
 * - com `prefers-reduced-motion`, o vídeo não é montado: fica só o poster.
 *
 * Autoplay COM som é bloqueado pelos navegadores; mudo é permitido — por isso não há
 * botão de som aqui. Som sob demanda é assunto do bloco de vídeo próprio, não do card.
 */
export function CardVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [perto, setPerto] = useState(false);
  const [semMovimento, setSemMovimento] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplica = () => setSemMovimento(mq.matches);
    aplica();
    mq.addEventListener("change", aplica);
    return () => mq.removeEventListener("change", aplica);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || semMovimento) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPerto(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [semMovimento]);

  if (semMovimento) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="" aria-hidden className={className} />;
  }

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      className={className}
    >
      {perto && <source src={src} type="video/mp4" />}
    </video>
  );
}
