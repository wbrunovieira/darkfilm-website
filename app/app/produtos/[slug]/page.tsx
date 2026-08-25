import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Reveal } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import { categorias, getProduto, grupoDe, produtos } from "@/lib/produtos";
import { whatsappUrl } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduto(slug);
  if (!p) return {};
  const plain = p.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return { title: p.title, description: plain.slice(0, 155) };
}

export default async function ProdutoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProduto(slug);
  if (!p) notFound();

  const cat = categorias[p.category];
  const grupo = grupoDe(p.slug);
  const related = produtos
    .filter((o) => o.slug !== p.slug && (grupo ? grupo.slugs.includes(o.slug) : o.category === p.category))
    .slice(0, 4);
  const [main, ...rest] = p.photos;

  return (
    <>
      <section className="container-x pt-28 md:pt-36">
        <nav aria-label="Você está em" className="mb-8 flex flex-wrap items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-fg-3">
          <Link href="/" className="hover:text-fg">Início</Link>
          <span aria-hidden>/</span>
          <Link href={cat.href} className="hover:text-fg">{cat.nome}</Link>
          {grupo && (
            <>
              <span aria-hidden>/</span>
              <span>{grupo.nome}</span>
            </>
          )}
        </nav>

        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal className="space-y-3">
            {main && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
                <Image src={main.src} alt={p.title} fill priority sizes="(min-width: 768px) 55vw, 100vw" className="object-contain p-6" />
              </div>
            )}
            {rest.length > 0 && <PhotoGrid photos={rest.map((r) => ({ ...r, alt: p.title }))} columns="4" />}
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow mb-4">{grupo?.nome ?? cat.nome}</p>
            <h1 className="display text-4xl md:text-6xl">{p.title}</h1>
            {p.subtitle && <p className="mt-3 text-lg text-fg-2">{p.subtitle}</p>}
            <div className="prose-dark mt-8" dangerouslySetInnerHTML={{ __html: p.description }} />
            <a
              href={whatsappUrl(`Olá! Tenho interesse em: ${p.title}. Podem me passar mais informações?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-red px-7 py-4 font-display text-lg font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-red-2"
            >
              <WhatsAppIcon className="size-5" />
              Consultar disponibilidade
            </a>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x mt-24 border-t border-line pt-16">
          <Reveal className="mb-8 flex items-end justify-between gap-6">
            <h2 className="display text-3xl md:text-4xl">Veja também</h2>
            <Link href={cat.href} className="group inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-fg-2 hover:text-fg">
              {cat.nome} <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/produtos/${r.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg-2 transition-colors hover:border-line-strong">
                  <div className="relative aspect-square bg-white">
                    {r.photos[0] && <Image src={r.photos[0].src} alt={r.title} fill sizes="25vw" className="object-contain p-4 transition-transform duration-700 group-hover:scale-105" />}
                  </div>
                  <div className="flex flex-1 items-end justify-between gap-3 p-4">
                    <h3 className="font-display text-lg font-semibold uppercase leading-none">{r.title}</h3>
                    <ArrowIcon className="size-5 shrink-0 text-fg-3 transition-all group-hover:translate-x-1 group-hover:text-red-2" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-16">
        <ContactCTA />
      </div>
    </>
  );
}
