import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { PageHero } from "@/components/PageHero";
import { Callout, IconList, Stat } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ArrowIcon } from "@/components/icons";
import { ContactCTA } from "@/components/ContactCTA";
import { ProximoPasso } from "@/components/ProximoPasso";
import {
  AlertIcon,
  ColorIcon,
  GlareIcon,
  HeatIcon,
  PrivacyIcon,
  ShatterIcon,
  SignalIcon,
  SkinIcon,
  UvIcon,
  WarrantyIcon,
} from "@/components/icons/peliculas";

export const metadata: Metadata = {
  title: "Credenciada 3M",
  description:
    "Aplicadora credenciada 3M em Petrópolis. Linhas automotivas Crystalline, Ceramic IR, Color Stable IR, FX e SAS Segurança, com boletim técnico oficial de cada uma.",
};

type Item = { icon: ReactNode; text: string };
type Linha = {
  nome: string;
  tag: string;
  resumo: string;
  /** Tonalidades que a loja trabalha nesta linha (lista do cliente, 02/09/2026). */
  tonalidades: string[];
  /** Garantia 3M, conferida no boletim técnico oficial de cada série. */
  garantia: string;
  /** Boletim técnico oficial da 3M. `nota` avisa quando o PDF não está em português. */
  boletim: { url: string; nota?: string };
  /** Foto da oficina ao fundo do card, bem apagada — no lugar do preto chapado. */
  fundo: string;
  specs: { icon: ReactNode; value: string; label: string }[];
  itens: Item[];
};
/**
 * As cinco linhas automotivas que a loja trabalha, conforme a lista que o cliente mandou em
 * 02/09/2026 e as fotos do catálogo impresso 3M/Segvel que ele enviou junto.
 *
 * Saíram EX e Black Chrome: ele disse que não fazem parte das linhas automotivas da loja.
 * CS Premium e FX Pro não sumiram — são o nome antigo de Color Stable IR e FX; o catálogo atual
 * da 3M usa a nomenclatura nova.
 *
 * Tonalidades, garantias e características vêm dos boletins técnicos oficiais da 3M, conferidos
 * um a um em 03/09/2026. **O servidor da 3M ignora o nome do arquivo na URL — só o código do meio
 * identifica o documento** —, então cada PDF foi aberto e lido para confirmar qual série era.
 */
/* Foto de fundo de cada card, do acervo do próprio cliente. O catálogo impresso da 3M põe uma
   foto de carro atrás de cada série, e ele pediu o mesmo aqui — hoje o fundo é preto chapado.
   As imagens do catálogo NÃO servem: são material de marketing 3M/Segvel, com marca do
   distribuidor. Estas são da oficina dele. */
const linhas: Linha[] = [
  {
    nome: "Crystalline",
    fundo: "/img/novo/aplicacao-carros--audi-tt-tres-quartos.jpg",
    tag: "Transparente · alta tecnologia",
    resumo: "A mais alta tecnologia em películas transparentes com excelente rejeição ao calor. Perfeita para todos os veículos, inclusive para uso em para-brisa.",
    tonalidades: ["CR20", "CR40", "CR70", "CR90"],
    garantia: "15 anos",
    boletim: { url: "https://multimedia.3m.com/mws/media/2111861O/3m-technical-data-sheet-automotive-window-film-serie-crystalline-portuguese-version.pdf" },
    specs: [
      { icon: <HeatIcon />, value: "97%", label: "infravermelho rejeitado" },
      { icon: <UvIcon />, value: "99,9%", label: "UV bloqueado" },
      { icon: <WarrantyIcon />, value: "15 anos", label: "garantia" },
    ],
    itens: [
      { icon: <GlareIcon />, text: "Mantém a aparência original do veículo: a tonalidade levemente colorida preserva a visibilidade." },
      { icon: <HeatIcon />, text: "Melhora o conforto: rejeita até 97% dos raios infravermelhos e boa parte do calor solar." },
      { icon: <SignalIcon />, text: "Nenhuma interferência de sinal de GPS e celular: não é metalizada." },
      { icon: <UvIcon />, text: "Proteção do interior: bloqueia até 99,9% dos raios UV, retardando o desbotamento." },
            /* O texto legado do site de 2013 dizia "FPS superior a 1.700". O boletim oficial e o
         catálogo impresso do cliente dizem 1.000+ — e a própria página exibe "FPS 1.000+" mais
         abaixo. Três números para a mesma coisa, num bloco cuja tese é "o dado oficial está no
         boletim". Fica o número do boletim. */
      { icon: <SkinIcon />, text: "Proteção da pele: FPS de até 1.000 — recomendada pela Skin Cancer Foundation." },
      { icon: <ColorIcon />, text: "Nunca muda de cor: garantia de 15 anos." },
    ],
  },
  {
    nome: "Ceramic IR",
    fundo: "/img/novo/aplicacao-carros--hatch-eletrico-cinza.jpg",
    tag: "Nano-cerâmica · não interfere no sinal",
    resumo: "Desenvolvida com nanocerâmica, oferece alto nível de rejeição de infravermelho. A tecnologia é compatível com dispositivos 5G e não interfere nos sinais wireless.",
    tonalidades: ["CIR05", "CIR15", "CIR35", "CIR50"],
    garantia: "12 anos",
    boletim: { url: "https://multimedia.3m.com/mws/media/2173898O/3m-data-sheet-awf-serie-ceramic-ir-portuguese.pdf" },
    specs: [
      { icon: <HeatIcon />, value: "IR", label: "alta rejeição" },
      { icon: <SignalIcon />, value: "5G", label: "compatível" },
      { icon: <WarrantyIcon />, value: "12 anos", label: "garantia" },
    ],
    itens: [
      { icon: <PrivacyIcon />, text: "Aumenta a privacidade e a segurança." },
      { icon: <ColorIcon />, text: "Não fica roxa." },
      { icon: <HeatIcon />, text: "Reduz o calor com tecnologia nano-cerâmica." },
      { icon: <GlareIcon />, text: "Reduz o ofuscamento." },
      { icon: <SkinIcon />, text: "Bloqueia 99% dos raios UV, com FPS de até 1.000." },
      { icon: <SignalIcon />, text: "Não metalizada: não interfere em celular, GPS e sinais 5G." },
    ],
  },
  {
    nome: "Color Stable IR",
    fundo: "/img/novo/aplicacao-carros--peugeot-2008-traseira-vidros.jpg",
    tag: "Cerâmica · a cor não muda",
    resumo: "Tecnologia enriquecida com nanopartículas cerâmicas, que asseguram que o filme não ficará roxo com o tempo.",
    tonalidades: ["CS IR5", "CS IR15", "CS IR35", "CS IR50", "CS IR70"],
    garantia: "10 anos",
    /* Os 10 anos são os do catálogo brasileiro da 3M, que é o material sob o qual a loja vende.
       O boletim linkado é a versão internacional, em inglês, e fala em "limited lifetime
       warranty" — por isso a nota avisa, para quem clicar não achar que um dos dois está errado. */
    boletim: {
      url: "https://multimedia.3m.com/mws/media/2414956O/3m-automotive-window-film-color-stable-cs-ir-series-product-bulletin-rev-c.pdf",
      nota: "versão internacional, em inglês",
    },
    specs: [
      { icon: <ColorIcon />, value: "Não", label: "fica roxa" },
      { icon: <SignalIcon />, value: "Sem metal", label: "não bloqueia sinal" },
      { icon: <WarrantyIcon />, value: "10 anos", label: "garantia" },
    ],
    itens: [
      { icon: <PrivacyIcon />, text: "Aumenta a privacidade e a segurança." },
      { icon: <ColorIcon />, text: "Não fica roxa, mesmo com o tempo." },
      { icon: <HeatIcon />, text: "Reduz o calor." },
      { icon: <GlareIcon />, text: "Reduz o ofuscamento e melhora a visibilidade à noite." },
      { icon: <SkinIcon />, text: "Bloqueia 99% dos raios UV, com FPS de até 1.000." },
      { icon: <SignalIcon />, text: "Não metalizada: não interfere no sinal." },
    ],
  },
  {
    nome: "FX",
    fundo: "/img/novo/aplicacao-carros--byd-sedan-frente-pelicula.jpg",
    tag: "Estética e proteção · melhor custo",
    resumo: "Excelente desempenho e redução de ofuscamento a um preço atraente. Proporciona privacidade e aprimoramento estético ao automóvel.",
    tonalidades: ["FX5", "FX20", "FX35", "FX50", "FX70"],
    garantia: "3 anos",
    boletim: {
      url: "https://multimedia.3m.com/mws/media/2111862O/3m-technical-data-sheet-automotive-window-film-serie-fx-portuguese-version.pdf",
      nota: "a 3M chama a série de FX-ST",
    },
    specs: [
      { icon: <GlareIcon />, value: "Menos", label: "ofuscamento" },
      { icon: <PrivacyIcon />, value: "Sim", label: "privacidade" },
      { icon: <WarrantyIcon />, value: "3 anos", label: "garantia" },
    ],
    itens: [
      { icon: <GlareIcon />, text: "Reduz o ofuscamento." },
      { icon: <HeatIcon />, text: "Reduz o calor." },
      { icon: <PrivacyIcon />, text: "Aumenta a privacidade e melhora a estética do veículo." },
      { icon: <SignalIcon />, text: "Não metalizada: não interfere no sinal." },
    ],
  },
  {
    nome: "SAS Segurança",
    fundo: "/img/novo/aplicacao-carros--bmw-porta-aberta.jpg",
    tag: "Película de segurança · Scotchshield",
    resumo: "Mantém os estilhaços unidos à película em caso de quebra do vidro. As versões que somam segurança e proteção solar ainda aumentam a privacidade e rejeitam calor.",
    tonalidades: ["SAS5", "SAS20", "SAS35"],
    garantia: "3 anos",
    boletim: { url: "https://multimedia.3m.com/mws/media/2111863O/3m-technical-data-sheet-automotive-window-film-serie-scotchshield-portuguese-version.pdf" },
    specs: [
      { icon: <ShatterIcon />, value: "Estilhaços", label: "ficam presos" },
      { icon: <UvIcon />, value: "99%", label: "UV bloqueado" },
      { icon: <WarrantyIcon />, value: "3 anos", label: "garantia" },
    ],
    itens: [
      { icon: <ShatterIcon />, text: "Protege contra fragmentos de vidro projetados para o interior do veículo." },
      { icon: <UvIcon />, text: "Bloqueia até 99% dos raios UV, ajudando a proteger a pele e reduzindo o desbotamento." },
      { icon: <PrivacyIcon />, text: "Aumenta a privacidade e reduz o brilho excessivo (exceto na versão transparente)." },
      { icon: <HeatIcon />, text: "Diminui o calor solar que entra pela janela (exceto na versão transparente)." },
      { icon: <SignalIcon />, text: "Composição livre de metais: não afeta celular, GPS e rádio via satélite." },
    ],
  },
];

/**
 * Comparativo enxuto, a pedido do cliente em 02/09/2026: o quadro anterior tinha seis colunas de
 * números e virava tabela larga com rolagem horizontal no celular — que é onde a maioria acessa.
 * A regra que ele deu: informação comercial simples no site, informação técnica completa no
 * boletim oficial da 3M. Cada linha tem o botão do boletim ao lado.
 */
const comparativo: { k: string; v: (l: Linha) => string }[] = [
  { k: "Tonalidades", v: (l) => l.tonalidades.join(", ") },
  { k: "Garantia 3M", v: (l) => l.garantia },
];


export default function TresMPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Início", href: "/" }, { label: "Películas" }, { label: "Credenciada 3M" }]}
        title={
          <>
            Menos calor.
            <br />
            <span className="text-red-2">Mais proteção.</span>
          </>
        }
        intro="Melhoria do conforto e proteção do interior do veículo e dos seus ocupantes é uma marca registrada das Películas para Vidros da 3M da Linha Automotiva. A 3M inventou as películas para vidros em 1966 e seus produtos vêm fornecendo proteção contra os raios solares há mais de 40 anos."
        /* Antes o hero era o mostruário de tonalidades, de 400x266, esticado como banner.
           Agora é o próprio selo na fachada da loja: "3M · Aplicador Autorizado Automotivo
           · Películas para Vidros", com o número 1767 e o letreiro da casa. */
        image="/img/novo/institucional--selo-3m-fachada.jpg"
        imagePosition="center 40%"
      />

      <section className="pel-atmo relative overflow-hidden border-t border-line">
        <div aria-hidden className="pel-num pointer-events-none absolute -right-6 top-6 text-[30vw] leading-none md:text-[18rem]">
          3M
        </div>
        <div className="container-x relative grid gap-12 py-16 md:grid-cols-[1.3fr_1fr] md:gap-16 md:py-24">
          <Reveal className="prose-dark">
            <p className="eyebrow mb-4">Por que 3M</p>
            <p>
              Se você procura alta tecnologia para a redução do calor ou para minimizar os efeitos
              prejudiciais do sol, as Películas para Vidros da 3M da Linha Automotiva são a escolha
              ideal. Ainda que estilo e conforto sejam fundamentais, as opções de películas não
              metalizadas ajudam você a permanecer conectado e protegido com um fator de proteção
              solar (FPS) superior a 1.000. Coloque a inovação da 3M para trabalhar para você.
            </p>
            <IconList
              columns={2}
              items={[
                { icon: <HeatIcon />, title: "Redução do calor", text: "Alta tecnologia para reduzir o calor no interior." },
                { icon: <SignalIcon />, title: "Sem interferência", text: "Películas não metalizadas: GPS e celular conectados." },
                { icon: <SkinIcon />, title: "FPS superior a 1.000", text: "Proteção para a pele dos ocupantes." },
                { icon: <UvIcon />, title: "Proteção do interior", text: "Minimiza os efeitos prejudiciais do sol." },
              ]}
            />
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-1">
            <Reveal><Stat value="1966" label="Ano em que a 3M inventou as películas para vidros" /></Reveal>
            <Reveal delay={0.1}><Stat value="40+" label="Anos fornecendo proteção contra os raios solares" /></Reveal>
            <Reveal delay={0.2}><Stat value="FPS 1.000+" label="Fator de proteção solar das películas não metalizadas" /></Reveal>
          </div>
        </div>
      </section>

      <section className="container-x border-t border-line py-16 md:py-24">
        <Reveal className="mb-12 md:mb-16">
          <p className="eyebrow mb-3">Linha automotiva 3M</p>
          <h2 className="display text-3xl md:text-5xl">Cinco películas, cinco propósitos.</h2>
          <p className="mt-5 max-w-2xl text-fg-2">
            Cada card traz as tonalidades que trabalhamos naquela linha e o link para o boletim
            técnico oficial da 3M, com os números completos.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-4" stagger={0.1}>
          {linhas.map((l, i) => (
            <RevealItem key={l.nome} className="pel-card relative isolate overflow-hidden">
              {/* A foto vai bem apagada e coberta por um degradê: precisa dar profundidade sem
                  competir com o texto, que é o que a página tem para dizer. */}
              <Image
                src={l.fundo}
                alt=""
                fill
                aria-hidden
                sizes="(min-width: 768px) 60vw, 100vw"
                className="-z-10 object-cover opacity-[0.3]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(105deg,var(--bg)_10%,rgba(11,11,13,0.92)_44%,rgba(11,11,13,0.55)_100%)]"
              />
              <span aria-hidden className="pel-card__ghost">0{i + 1}</span>
              <div className="relative grid gap-8 p-6 md:grid-cols-[260px_1fr] md:gap-12 md:p-10">
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="font-display text-xs tracking-[0.22em] text-fg-3">3M · 0{i + 1}</p>
                    <h3 className="display mt-2 text-4xl md:text-5xl">
                      <span className="text-red-2">{l.nome}</span>
                    </h3>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-fg-3">{l.tag}</p>
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {l.tonalidades.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line-strong px-2.5 py-1 font-display text-xs font-semibold tracking-[0.1em] text-fg-2"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm leading-relaxed text-fg-2">{l.resumo}</p>
                </div>

                <div className="min-w-0">
                  <div className={`grid gap-4 border-b border-line pb-6 ${l.specs.length > 1 ? "sm:grid-cols-3" : ""}`}>
                    {l.specs.map((s) => (
                      <div key={s.label} className="pel-spec">
                        <span className="pel-icon pel-icon--sm pel-icon--accent">{s.icon}</span>
                        <div className="min-w-0">
                          <p className="pel-spec__value">{s.value}</p>
                          <p className="pel-spec__label">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <IconList items={l.itens} />

                  {/* O detalhe técnico completo mora no boletim da 3M, não na página — foi o
                      critério que o cliente deu. Os PDFs são do servidor da própria 3M. */}
                  <a
                    href={l.boletim.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex min-h-12 items-center gap-2.5 rounded-full border border-line-strong px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.14em] text-fg-2 transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-red hover:text-fg"
                  >
                    Acessar boletim técnico
                    <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    {l.boletim.nota && (
                      <span className="font-sans text-xs font-normal normal-case tracking-normal text-fg-3">
                        ({l.boletim.nota})
                      </span>
                    )}
                  </a>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="pel-atmo pel-atmo--cool border-t border-line">
        <div className="container-x py-16 md:py-24">
          <Reveal className="mb-8 md:mb-10">
            <p className="eyebrow mb-3">Comparativo</p>
            <h2 className="display text-3xl md:text-5xl">Lado a lado.</h2>
          </Reveal>
          {/* No celular a tabela vira cartões empilhados: o formato anterior era largo demais e
              só se lia arrastando de lado. */}
          <Reveal delay={0.1} className="grid gap-3 md:hidden">
            {linhas.map((l) => (
              <div key={l.nome} className="border border-line bg-bg/60 p-4">
                <p className="font-display text-lg font-semibold uppercase text-fg">{l.nome}</p>
                <dl className="mt-2 grid gap-1 text-sm">
                  {comparativo.map((c) => (
                    <div key={c.k} className="flex flex-wrap justify-between gap-x-3">
                      <dt className="text-fg-3">{c.k}</dt>
                      <dd className="text-right text-fg-2">{c.v(l)}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={l.boletim.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-red-2 underline underline-offset-4"
                >
                  Boletim técnico
                </a>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="hidden border border-line bg-bg/60 md:block">
            <table className="pel-table">
              <caption className="sr-only">Comparativo das películas 3M da Linha Automotiva</caption>
              <thead>
                <tr>
                  <th scope="col">Película</th>
                  {comparativo.map((c) => (
                    <th key={c.k} scope="col">{c.k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {linhas.map((l) => (
                  <tr key={l.nome}>
                    <th scope="row">{l.nome}</th>
                    {comparativo.map((c) => (
                      <td key={c.k}>{c.v(l)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <div className="mt-8">
            <Callout icon={<AlertIcon />}>
              <strong className="text-fg">Nota:</strong> a legislação sobre a transparência de películas
              automotivas pode variar localmente. Consulte as legislações aplicáveis ou entre em contato
              conosco.
            </Callout>
          </div>
        </div>
      </section>

      <ProximoPasso
        titulo="Veja a 3M aplicada"
        itens={[
          { href: "/peliculas-automotivas", label: "Películas Automotivas", texto: "Como aplicamos no seu carro, e o que a lei permite em cada vidro." },
          { href: "/galeria", label: "Galeria de trabalhos", texto: "Fotos reais de aplicação saídas da nossa oficina." },
          { href: "/simulador", label: "O que a lei permite", texto: "O mínimo de transmissão luminosa exigido em cada vidro." },
        ]}
      />

      <ContactCTA />
    </>
  );
}
