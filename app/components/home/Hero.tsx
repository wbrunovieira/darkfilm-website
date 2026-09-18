"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { decadasEmAtividade, site, whatsappUrl, yearsInBusiness } from "@/lib/site";
import { ArrowIcon, WhatsAppIcon } from "../icons";
import { GoogleBadge } from "../GoogleBadge";
import { Credenciais, CredenciaisMobile } from "./Credenciais";

const ease = [0.16, 1, 0.3, 1] as const;

/** Placas da parede da loja (asset do site original), reinterpretadas como detalhe de
 *  ambiente e não como elemento de layout: pequenas, dessaturadas, "penduradas" logo
 *  abaixo do header e com fade na base (esconde a placa do cachorro, que ruía o tom).
 *  Ficam fora da coluna de texto em qualquer largura. */
function Placas() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -80]);

  return (
    <motion.div
      aria-hidden
      style={{ y }}
      className="pointer-events-none absolute right-0 top-14 z-0 w-[34vw] max-w-[150px] md:top-[5.5rem] md:w-[18vw] md:max-w-[230px] lg:right-4 xl:max-w-[260px]"
    >
      <motion.div
        initial={{ opacity: 0, y: -24, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.4, delay: 0.6, ease }}
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, #000 50%, transparent 82%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 50%, transparent 82%)",
        }}
      >
        <Image
          src="/img/marca/placas-topo.png"
          alt=""
          width={472}
          height={439}
          priority
          className="h-auto w-full opacity-50 saturate-[0.55] brightness-[0.85] drop-shadow-[0_24px_30px_rgba(0,0,0,0.7)] md:opacity-60"
        />
      </motion.div>
    </motion.div>
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
      {/* Foto de fundo: a fachada à noite com o Porsche 356 vermelho de corrida na frente,
          escolhida pelo cliente em 12/09/2026 e confirmada por ele em 18/09. Já nasce escura e
          com o vermelho da marca no carro, o que combina com o título branco sobre a máscara —
          a fachada de dia, que estava aqui antes, tinha céu azul e brigava com o texto.

          **O arquivo foi alargado de propósito, de 1536x1024 para 2048x1024.** A foto do cliente
          é 3:2 e o hero em tela larga fica perto de 2:1: com `object-cover` sobrava um quarto da
          altura fora do quadro, e o que se perdia era o pé da foto — as rodas do carro. Ele mandou
          uma montagem mostrando o enquadramento que quer, com a fachada e o carro inteiros.

          Em vez de cortar o carro, o quadro ganhou laterais: ao fundo vai a própria foto ampliada,
          borrada e escurecida, e a foto nítida entra por cima com as bordas esmaecidas em 200px.
          Sem emenda visível, e o enquadramento dele cabe inteiro. Se um dia vier a original em
          alta, o mesmo tratamento se refaz com o script em `scratchpad` ou à mão.

          A foto nítida entra alinhada à direita dentro do quadro, e é isso que põe as duas portas
          da loja na segunda coluna e deixa o Porsche inteiro, fora do texto — o arranjo da
          montagem que ele mandou. À esquerda fica o borrão escuro, que é onde o texto mora.

          Os carros estacionados ao fundo, na rua, foram apagados a pedido dele: não são da loja.

          Em tela estreita não existe segunda coluna — o texto ocupa tudo — então ali o ponto
          focal vai para 74%, senão o corte lateral fica só na loja e o carro sai do quadro. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/novo/institucional--fachada-noite-porsche.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="photo-hero object-cover object-[74%_58%] animate-slow-zoom lg:object-[50%_62%]"
        />
        <div className="tint-overlay-hero" />
      </div>

      {/* As placas decorativas saíram daqui em 17/09/2026, a pedido do cliente: ele quis o
          espaço para as três credenciais (3M, Mercado Livre, Thule), que é o que ele considera
          mais importante mostrar antes de a pessoa rolar a página. O componente `Placas` continua
          neste arquivo, sem uso, caso a decisão volte atrás. */}
      <Credenciais />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:pb-20 md:pt-32 short:pb-12 short:pt-24">
        <motion.p {...fade(0.3)} className="eyebrow mb-4 md:mb-5 short:mb-3">
          {site.city}/{site.state} · desde {site.founded}
        </motion.p>

        {/* No celular as credenciais entram no fluxo: a versão da direita não cabe numa tela
            estreita, e o pedido dele é que apareçam antes de a pessoa rolar. */}
        <CredenciaisMobile />

        {/* O título fica preso à metade esquerda em tela larga. A montagem que o cliente mandou
            em 12/09/2026 mostra o carro INTEIRO, livre, à direita do texto — e com `max-w-5xl`
            ele ia até 69% da largura num monitor de 1900, passando por cima do Porsche. O teto
            em 48vw mantém a coluna de texto no escuro da fachada, que é onde ela se lê melhor,
            e devolve o carro por completo. Abaixo de 1024px não muda nada: ali o texto ocupa a
            tela toda mesmo, e o carro aparece atrás, de propósito. */}
        <h1 className="display max-w-5xl text-[clamp(2.75rem,min(9.5vw,14vh),8rem)] short:text-[clamp(2.5rem,min(8.5vw,12vh),6rem)] text-fg lg:max-w-[min(43vw,46rem)] lg:text-[clamp(2.5rem,min(4.6vw,11vh),4.6rem)]">
          <motion.span {...fade(0.4)} className="block">
            Película, som
          </motion.span>
          <motion.span {...fade(0.5)} className="block">
            e acessórios com
          </motion.span>
          <motion.span {...fade(0.6)} className="block">
            {yearsInBusiness()} anos de estrada.
          </motion.span>
        </h1>

        <motion.p
          {...fade(0.75)}
          className="mt-6 max-w-lg text-base leading-relaxed text-fg-2 md:mt-8 md:text-lg short:mt-4 short:max-w-xl short:text-base lg:max-w-[min(36vw,30rem)]"
        >
          Há mais de {decadasEmAtividade()}, a The Dark Film é referência em películas
          automotivas e arquitetônicas, som e acessórios em {site.city}. Produtos de
          qualidade, instalação profissional e a confiança de uma aplicadora credenciada{" "}
          <strong className="text-fg">3M</strong>.
        </motion.p>

        <motion.div {...fade(0.9)} className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 md:mt-10 short:mt-5">
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
            href="/peliculas-automotivas"
            className="group inline-flex items-center gap-3 px-2 py-4 font-display text-lg font-medium uppercase tracking-[0.14em] text-fg-2 transition-colors hover:text-fg"
          >
            Conhecer as películas
            <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div {...fade(1.05)} className="mt-8 md:mt-10 short:mt-4">
          <GoogleBadge variant="hero" />
        </motion.div>
      </div>
    </section>
  );
}
