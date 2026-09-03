"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

/**
 * Botão flutuante de WhatsApp.
 *
 * Três correções vindas da auditoria de navegação, todas medidas no navegador:
 *
 * 1. **Ficava por cima do menu mobile aberto.** Ele era `z-50` e o painel do menu é `z-40`:
 *    apareciam dois botões verdes empilhados, um tapando o outro, em cima do último item do
 *    menu. Agora é `z-30` — acima do conteúdo, abaixo do painel.
 * 2. **Tapava um card de produto em 11 de 11 posições de rolagem** do catálogo. Numa página
 *    cujo trabalho inteiro é fazer a pessoa entrar num produto, era uma zona morta permanente
 *    no canto. Agora ele sai de cena enquanto se rola para baixo e volta assim que a pessoa
 *    rola para cima — que é quando ela está procurando algo, não lendo a lista.
 * 3. **No celular ocupava a largura de uma pílula com texto.** Vira só o ícone abaixo de `md`,
 *    onde o espaço é disputado; o rótulo continua no desktop.
 *
 * Fica escondido em /contato, onde é redundante com o formulário e com o botão de WhatsApp
 * da própria página.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    let ultimo = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // perto do topo ele fica sempre; a partir daí, só quem sobe o traz de volta
      if (y < 240) setVisivel(true);
      else if (y > ultimo + 8) setVisivel(false);
      else if (y < ultimo - 8) setVisivel(true);
      ultimo = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/contato") return null;

  return (
    <a
      href={whatsappUrl("Olá! Vim pelo site da The Dark Film e gostaria de um orçamento.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar no WhatsApp ${site.whatsapp.label}`}
      /* `inert` porque `pointer-events:none` não tira da ordem de foco: escondido, ele
         continuava tabulável, invisível e fora da viewport — e o Enter ainda o ativava. */
      {...(visivel ? {} : { inert: true })}
      className={`group fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-full bg-[#25D366] p-3.5 text-[#062b16] shadow-[0_12px_40px_-8px_rgba(37,211,102,0.6)] transition-[transform,opacity] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none md:bottom-7 md:right-7 md:py-3 md:pl-4 md:pr-5 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <span className="relative grid size-6 place-items-center">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" aria-hidden />
        <WhatsAppIcon className="relative size-6" />
      </span>
      <span className="hidden font-display text-base font-semibold uppercase tracking-wider md:inline">
        WhatsApp
      </span>
    </a>
  );
}
