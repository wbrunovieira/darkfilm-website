import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { ArrowIcon } from "./icons";

/**
 * Saídas no fim de uma página.
 *
 * Existe porque a auditoria de navegação contou os links internos do corpo de cada página e
 * achou três becos sem saída — /3m, /caracteristicas-do-film e /galeria tinham ZERO links
 * saindo. Chegou ali, ou usava o menu, ou o botão voltar. Pior: as duas páginas que o projeto
 * trata como ativos principais (a credencial 3M, que é autoridade comercial real, e a galeria,
 * com 580 fotos) eram justamente folhas mortas — um link entrando, nenhum saindo.
 *
 * Fica antes do ContactCTA de propósito: quem não está pronto para falar no WhatsApp ainda
 * tem para onde ir dentro do site, em vez de sair.
 */
export function ProximoPasso({
  titulo = "Continue por aqui",
  itens,
}: {
  titulo?: string;
  itens: { href: string; label: string; texto: string }[];
}) {
  return (
    <section className="container-x border-t border-line py-14 md:py-20">
      <Reveal>
        <p className="eyebrow mb-6">{titulo}</p>
      </Reveal>
      <RevealGroup className="grid gap-4 md:grid-cols-3" stagger={0.08}>
        {itens.map((i) => (
          <RevealItem key={i.href}>
            <Link
              href={i.href}
              className="group flex h-full min-h-36 flex-col justify-between gap-4 rounded-lg border border-line bg-bg-2 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong"
            >
              <span>
                <span className="block font-display text-xl font-semibold uppercase leading-tight text-fg">
                  {i.label}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-fg-2">{i.texto}</span>
              </span>
              <ArrowIcon className="size-5 shrink-0 text-fg-3 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-red-2" />
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
