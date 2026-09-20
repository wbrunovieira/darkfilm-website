import Image from "next/image";
import { Reveal } from "../Reveal";
import { WhatsAppIcon } from "../icons";
import { whatsappUrl } from "@/lib/site";
import { POLIMENTO } from "@/content/polimento-vidros";

/**
 * Polimento de vidros automotivos, dentro da página do conserto de para-brisa.
 *
 * Pedido do cliente em 19/09/2026: "adicionar nesta mesma página uma seção específica". É seção
 * e não página porque é o mesmo assunto — recuperar o vidro do carro em vez de trocar — e quem
 * chega ali procurando conserto é exatamente quem também tem risco de palheta.
 *
 * O botão abre o WhatsApp com a mensagem já preenchida, mesmo padrão da consulta da Thule. Ele
 * escreveu só "SOLICITAR AVALIAÇÃO", sem dizer para onde; WhatsApp é o canal dele e o único
 * caminho de conversão que o site tem hoje.
 */
export function PolimentoVidros() {
  return (
    <section
      id="polimento-de-vidros"
      className="container-x mt-24 scroll-mt-24 border-t border-line pt-16"
      aria-labelledby="polimento-titulo"
    >
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <Reveal>
          <p className="eyebrow mb-3">Também fazemos</p>
          <h2 id="polimento-titulo" className="display text-3xl md:text-5xl">
            {POLIMENTO.titulo}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-2">{POLIMENTO.chamada}</p>

          {POLIMENTO.paragrafos.map((t) => (
            <p key={t.slice(0, 28)} className="mt-4 text-sm leading-relaxed text-fg-2">
              {t}
            </p>
          ))}

          <a
            href={whatsappUrl(POLIMENTO.mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta mt-8"
          >
            <WhatsAppIcon className="size-5" />
            {POLIMENTO.botao}
          </a>
        </Reveal>

        <Reveal delay={0.1} className="grain relative overflow-hidden rounded-lg border border-line">
          <Image
            src={POLIMENTO.imagem.src}
            alt={POLIMENTO.imagem.alt}
            width={POLIMENTO.imagem.w}
            height={POLIMENTO.imagem.h}
            sizes="(min-width: 768px) 46vw, 92vw"
            className="block h-full w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
