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
 * **Sem foto, de propósito.** As cinco imagens que vieram com o pedido têm 307 por 281 pixels,
 * tamanho de miniatura, e mostram pessoas geradas por IA — uma delas com uma camisa de slogan que
 * não é da marca dele. Ampliar não resolve, e imagem genérica de banco não diz nada sobre película.
 * Cartão de texto fecha a seção agora e não finge que falta alguma coisa. Quando houver foto real
 * de aplicação por tecnologia, ela entra como topo do cartão.
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
          <p className="mt-5 text-lg leading-relaxed text-fg-2">{ABERTURA.texto}</p>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-3 md:grid-cols-2" stagger={0.06}>
          {TECNOLOGIAS.map((t, i) => (
            <RevealItem key={t.id} className="pel-tile">
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
            </RevealItem>
          ))}
        </RevealGroup>

        {/* A quinta não entra na grade das outras: resolve outro problema, e na fila delas a
            garantia de 3 anos leria como "a pior" em vez de "de outra natureza". */}
        <Reveal delay={0.1}>
          <article className="mt-3 border border-line-strong bg-bg-2 p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-[auto_1fr] md:gap-8">
              <span className="pel-icon pel-icon--accent md:mt-1">
                <ShieldIcon />
              </span>
              <div>
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
