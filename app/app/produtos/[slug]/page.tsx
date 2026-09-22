import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/PhotoGrid";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import { ChevronSmallIcon, PhotosIcon } from "@/components/icons/catalogo";
import { PolimentoVidros } from "@/components/produtos/PolimentoVidros";
import { EnvelopamentoTrabalhos } from "@/components/produtos/EnvelopamentoTrabalhos";
import { POLIMENTO } from "@/content/polimento-vidros";
import { SLUG as ENVELOPAMENTO, TEXTO as ENVEL_TEXTO } from "@/content/envelopamento";
import { categorias, getProduto, produtos } from "@/lib/produtos";
import { site, whatsappUrl } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduto(slug);
  if (!p) return {};
  const plain = p.description
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { title: p.title, description: plain.slice(0, 155) };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const p = getProduto(slug);
  if (!p) notFound();

  const cat = categorias[p.category];
  /* O nível "grupo" era do catálogo de som, que virou categorias em 22/09/2026 e levou os 41
     produtos junto. Restaram só as quatro páginas de película, que nunca tiveram grupo — o
     relacionamento volta a ser pela categoria, que é o que sempre foi para elas. */
  const related = produtos
    .filter((o) => o.slug !== p.slug && o.category === p.category)
    .slice(0, 4);
  const photos = p.photos.map((ph) => ({ ...ph, alt: p.title }));

  /* Envelopamento tem capa fotográfica e rótulo de botão próprios, os dois pedidos pelo cliente
     em 19/09/2026 ("SOLICITAR ORÇAMENTO", no lugar do padrão do catálogo). */
  const envelopamento = p.slug === ENVELOPAMENTO;
  const cta = envelopamento
    ? { rotulo: ENVEL_TEXTO.botao, mensagem: ENVEL_TEXTO.mensagem }
    : {
        rotulo: "Consultar disponibilidade",
        mensagem: `Olá! Tenho interesse em: ${p.title}. Podem me passar mais informações?`,
      };

  return (
    <>
      <section className="relative isolate overflow-hidden pt-28 md:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_85%_0%,rgba(209,20,31,0.12),transparent_70%)]"
        />
        <div className="container-x">
          <nav aria-label="Você está em" className="crumbs mb-8">
            <Link href="/">Início</Link>
            <ChevronSmallIcon aria-hidden />
            <Link href={cat.href}>{cat.nome}</Link>
            <ChevronSmallIcon aria-hidden />
            <span aria-current="page" className="truncate">
              {p.title}
            </span>
          </nav>

          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14 lg:gap-20">
            <Reveal>
              <ProductGallery
                photos={photos}
                title={p.title}
                variant={envelopamento ? "foto" : "catalogo"}
              />
            </Reveal>

            <Reveal delay={0.1} className="md:pt-2">
              <p className="eyebrow mb-4">{cat.nome}</p>
              <h1 className="display text-[clamp(2.5rem,6vw,4.5rem)]">
                {p.title}
              </h1>
              {p.subtitle && (
                <p className="mt-3 text-lg text-fg-2">{p.subtitle}</p>
              )}

              <dl className="prod-meta mt-8">
                <div>
                  <dt>Linha</dt>
                  <dd>
                    <Link href={cat.href}>{cat.nome}</Link>
                  </dd>
                </div>
                <div>
                  <dt>Fotos</dt>
                  <dd className="inline-flex items-center gap-1.5">
                    <PhotosIcon className="size-4 text-fg-3" />
                    {String(p.photos.length).padStart(2, "0")}
                  </dd>
                </div>
              </dl>

              <div
                className="prose-dark prod-desc mt-8"
                dangerouslySetInnerHTML={{ __html: p.description }}
              />

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href={whatsappUrl(cta.mensagem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta"
                >
                  <WhatsAppIcon className="size-5" />
                  {cta.rotulo}
                </a>
                <span className="text-sm text-fg-3">
                  WhatsApp {site.whatsapp.label}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Polimento de vidros: seção pedida pelo cliente em 19/09/2026 dentro desta página, e só
          dela. Entra antes dos produtos relacionados porque é serviço da casa, não sugestão. */}
      {p.slug === POLIMENTO.slug && <PolimentoVidros />}

      {/* Envelopamento: a transformação da Hilux e a galeria "Alguns dos nossos trabalhos",
          pedidas pelo cliente em 19/09/2026 para substituir a área que tinha uma foto só. */}
      {envelopamento && <EnvelopamentoTrabalhos />}

      {related.length > 0 && (
        <section className="container-x mt-24 border-t border-line pt-16">
          <Reveal className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">{cat.nome}</p>
              <h2 className="display text-3xl md:text-4xl">Veja também</h2>
            </div>
            <Link
              href={cat.href}
              className="group hidden items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-fg-2 transition-colors hover:text-fg sm:inline-flex"
            >
              Ver {cat.nome}{" "}
              <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <RevealGroup
            stagger={0.06}
            role="list"
            className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          >
            {related.map((r) => (
                <RevealItem key={r.slug} role="listitem" className="h-full">
                  <Link href={`/produtos/${r.slug}`} className="cat-card">
                    <div className="cat-card__media">
                      {r.photos[0] && (
                        <Image
                          src={r.photos[0].src}
                          alt={r.title}
                          fill
                          sizes="(min-width: 768px) 25vw, 50vw"
                          className="object-contain p-5"
                        />
                      )}
                    </div>
                    <div className="cat-card__body">
                      <h3 className="cat-card__title">{r.title}</h3>
                      <span className="cat-card__arrow" aria-hidden>
                        <ChevronSmallIcon className="size-4" />
                      </span>
                    </div>
                  </Link>
                </RevealItem>
            ))}
          </RevealGroup>
          <Link
            href={cat.href}
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-fg-2 hover:text-fg sm:hidden"
          >
            Ver {cat.nome} <ArrowIcon className="size-4" />
          </Link>
        </section>
      )}

      <div className="mt-16">
        <ContactCTA />
      </div>
    </>
  );
}
