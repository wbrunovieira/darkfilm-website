import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { ShieldIcon, WarrantyIcon } from "../icons/peliculas";
import { ABERTURA, SEGURANCA, TECNOLOGIAS } from "@/content/tecnologias";

/**
 * As tecnologias de película, depois do simulador.
 *
 * Pedido do cliente em 12/09/2026, com o texto pronto. Substitui o bloco anterior, que era quase
 * todo sobre película de segurança — reclamação dele. Segurança continua aqui, mas como uma entre
 * as opções, e não como a página inteira.
 *
 * **As imagens são as cinco que ele mandou, por decisão dele.** Elas têm 307 por 281 pixels e são
 * geradas por IA — uma traz uma vitrine inventada com o slogan "AUTOMOTIVE SOLUTIONS", que não é a
 * assinatura da marca, e a da segurança mostra uma criança. Isso foi levantado com ele e ele
 * decidiu usá-las assim mesmo.
 *
 * Como não dá para aumentar 307 pixels, a grade das quatro vai a QUATRO colunas em tela grande:
 * assim cada imagem é exibida menor do que o arquivo, e não maior. Em duas colunas elas seriam
 * ampliadas quase ao dobro e a perda de nitidez apareceria.
 *
 * **A garantia é o herói de cada cartão.** É o único número comparável entre as quatro e é
 * argumento de venda direto: sobe de 3 para 15 anos conforme a tecnologia. Texto corrido esconderia
 * isso; aqui ela fica ancorada no pé do cartão, sempre no mesmo lugar, e a escada se lê de relance.
 */
export function Tecnologias() {
  return (
    <section
      id="tecnologias"
      className="scroll-mt-24 border-t border-line bg-bg"
      aria-labelledby="tec-titulo"
    >
      <div className="container-x py-16 md:py-24">
        <Reveal className="max-w-3xl">
          <p className="eyebrow mb-3">Tecnologias</p>
          <h2 id="tec-titulo" className="display text-3xl md:text-5xl">
            {ABERTURA.titulo}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-2">
            {ABERTURA.texto}
          </p>
        </Reveal>

        <RevealGroup
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.06}
        >
          {TECNOLOGIAS.map((t, i) => (
            <RevealItem key={t.id} className="pel-tile !gap-0 !p-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={t.img}
                  alt={t.alt}
                  fill
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-bg-2/80 to-transparent"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3.5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold uppercase leading-tight md:text-2xl">
                    {t.titulo}
                  </h3>
                  <span
                    aria-hidden
                    className="pel-num shrink-0 text-3xl leading-none md:text-4xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-fg-2">{t.texto}</p>

                <p className="mt-auto flex items-center gap-2.5 border-t border-line pt-4 font-display text-sm font-semibold uppercase tracking-[0.12em] text-fg">
                  <WarrantyIcon className="size-[1.1rem] shrink-0 text-red-2" />
                  Garantia de {t.garantia} anos
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* A quinta não entra na grade das outras: resolve outro problema, e na fila delas a
            garantia de 3 anos leria como "a pior" em vez de "de outra natureza". */}
        <Reveal delay={0.1}>
          <article className="mt-3 overflow-hidden border border-line-strong bg-bg-2">
            <div className="grid gap-0 md:grid-cols-[minmax(0,18rem)_1fr]">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-full">
                <Image
                  src={SEGURANCA.img}
                  alt={SEGURANCA.alt}
                  fill
                  sizes="(min-width: 768px) 18rem, 92vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <span className="pel-icon pel-icon--accent mb-4 inline-grid">
                  <ShieldIcon />
                </span>
                <h3 className="font-display text-xl font-semibold uppercase leading-tight md:text-2xl">
                  {SEGURANCA.titulo}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-2">
                  {SEGURANCA.texto}
                </p>
                <p className="mt-5 flex items-center gap-2.5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-fg">
                  <WarrantyIcon className="size-[1.1rem] shrink-0 text-red-2" />
                  Garantia de {SEGURANCA.garantia} anos
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
