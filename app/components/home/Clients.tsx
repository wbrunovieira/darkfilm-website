import Image from "next/image";
import { site } from "@/lib/site";
import { CountUp } from "../CountUp";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { StarIcon } from "../icons/home";
import { CLIENTES } from "@/content/clientes";

/**
 * Bloco de clientes da home, refeito a pedido do cliente em 21/09/2026.
 *
 * Era uma grade de quatro nomes em texto. Palavras dele: o bloco tem que "deixar de ser apenas
 * uma relação de nomes e passar a mostrar visualmente alguns clientes e instituições atendidos".
 *
 * **O link "Conheça a empresa" saiu por pedido explícito dele** ("não é necessário nenhum botão
 * nessa seção"). Ele era, até aqui, a única entrada para `/a-empresa` no corpo do site — o menu
 * do topo continua levando lá, então a página não fica inalcançável, mas perde a única chamada
 * contextual que tinha.
 *
 * **O nome longo.** Ele pediu que "Fundação de Cultura e Turismo de Petrópolis" não deixasse seu
 * quadro visualmente diferente dos demais. A saída não é encolher a fonte só naquele quadro —
 * isso deixaria o desequilíbrio ainda mais visível — e sim quebrar o nome em duas linhas, com a
 * segunda em corpo menor, e dar a TODOS os quadros a mesma estrutura de duas linhas. Assim
 * "Auto Itália / Concessionária Fiat" e a Fundação seguem o mesmo molde, e GE Celma e
 * Tempermaster, que não têm segunda linha, ocupam a mesma caixa.
 */
export function Clients() {
  const rating = site.google.rating.toLocaleString("pt-BR");
  return (
    <section className="atmo atmo-soft overflow-hidden py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mb-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Quem confia</p>
            <h2 className="display text-4xl [text-wrap:balance] md:text-6xl">
              Qualidade reconhecida por quem confia no nosso trabalho.
            </h2>
          </div>

          <a
            href={site.google.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group card-lift relative shrink-0 overflow-hidden rounded-lg border border-line bg-bg-2 p-5 md:w-72"
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
            <p className="display flex items-baseline text-6xl">
              {rating}
              <span className="ml-1 text-2xl text-fg-3">/5</span>
            </p>
            <p className="mt-2 flex items-center gap-0.5 text-gold" aria-label={`${rating} de 5 estrelas`}>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className={`size-4 ${i < Math.round(site.google.rating) ? "" : "opacity-30"}`} />
              ))}
            </p>
            <p className="mt-2 text-sm text-fg-2">
              Nota no Google, com{" "}
              <strong className="text-fg">
                <CountUp value={String(site.google.reviews)} /> avaliações
              </strong>{" "}
              de clientes.
            </p>
            <p className="mt-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-fg-3 transition-colors group-hover:text-red-2">
              Ler avaliações →
            </p>
          </a>
        </Reveal>

        {/* Proporção fixa nos quatro quadros: é ela que padroniza o bloco, não o tamanho dos
            arquivos — eles chegaram em proporções diferentes. Quadrado no celular porque três
            das quatro imagens são quadradas e assim não sobra corte. */}
        <RevealGroup
          stagger={0.1}
          role="list"
          className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3"
        >
          {CLIENTES.map((c, i) => (
            <RevealItem key={c.nome} role="listitem">
              <figure className="group relative aspect-square overflow-hidden rounded-lg border border-line md:aspect-[4/3]">
                <Image
                  src={c.img}
                  alt={c.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  style={{ objectPosition: c.foco }}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />

                {/* Dois véus somados, e não um só: o escuro parelho nivela imagens de
                    luminosidade muito diferente (hangar cinza, fachada ensolarada), e o degradê
                    de baixo garante o contraste do nome sem apagar a foto inteira. Foi isto que
                    ele pediu com "leve escurecimento/degradê... para que as quatro imagens fiquem
                    visualmente padronizadas". */}
                <span aria-hidden className="absolute inset-0 bg-black/35" />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
                />
                {/* Véu de topo só para o número: sem ele o "01" cai sobre a parte clara do
                    hangar da turbina e some, enquanto nos outros três quadros o topo é escuro. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/55 to-transparent"
                />

                {/* `justify-between` com o nome sem altura mínima: o bloco de texto é ancorado
                    embaixo, então a ÚLTIMA linha de cada quadro fica na mesma altura, tenha o
                    nome uma linha ou três. Era este o desalinho que ele apontou no nome longo da
                    Fundação — reservar altura fixa fazia o contrário, empurrando os nomes curtos
                    para cima. */}
                <figcaption className="absolute inset-0 flex flex-col justify-between p-4 md:p-5">
                  <span className="font-display text-xs font-medium tabular-nums tracking-[0.2em] text-white/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="font-display block text-lg font-semibold uppercase leading-[1.05] text-white md:text-2xl">
                      {c.nome}
                    </span>
                    {c.complemento && (
                      <span className="mt-1 block font-display text-[0.7rem] font-medium uppercase leading-tight tracking-[0.12em] text-white/70 md:text-xs">
                        {c.complemento}
                      </span>
                    )}
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
