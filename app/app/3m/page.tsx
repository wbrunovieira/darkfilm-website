import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { PageHero } from "@/components/PageHero";
import { Callout, IconList, Stat } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import {
  AlertIcon,
  ColorIcon,
  GlareIcon,
  HeatIcon,
  MirrorIcon,
  SignalIcon,
  SkinIcon,
  UvIcon,
  WarrantyIcon,
} from "@/components/icons/peliculas";

export const metadata: Metadata = {
  title: "Credenciada 3M",
  description:
    "Aplicadora credenciada 3M em Petrópolis. Películas para vidros 3M linha automotiva: Crystalline, CS Premium, FX Pro, EX e Black Chrome. Menos calor, mais proteção.",
};

type Item = { icon: ReactNode; text: string };
type Linha = {
  nome: string;
  tag: string;
  resumo: string;
  /** Faixa de luz visível que a película deixa passar (do texto 3M). */
  vlt: [number, number];
  /** Specs em destaque, todas extraídas dos itens abaixo. */
  specs: { icon: ReactNode; value: string; label: string }[];
  itens: Item[];
};

// Conteúdo copiado da página "3M" do site original (catálogo de películas 3M).
const linhas: Linha[] = [
  {
    nome: "Crystalline",
    tag: "Transparente · alta tecnologia",
    resumo: "A mais alta tecnologia em películas transparentes com excelente rejeição ao calor. Perfeita para todos os veículos, inclusive para uso em para-brisa.",
    vlt: [40, 90],
    specs: [
      { icon: <HeatIcon />, value: "60%", label: "calor rejeitado" },
      { icon: <UvIcon />, value: "99,9%", label: "UV bloqueado" },
      { icon: <WarrantyIcon />, value: "15 anos", label: "garantia" },
    ],
    itens: [
      { icon: <GlareIcon />, text: "Mantém a aparência original do veículo: tonalidade levemente colorida permite que 40% a 90% da luz solar entre pelo vidro." },
      { icon: <HeatIcon />, text: "Melhora o conforto: rejeita até 97% dos raios infravermelhos e até 60% do calor solar." },
      { icon: <SignalIcon />, text: "Nenhuma interferência de sinal de GPS e celular: não é metalizada." },
      { icon: <UvIcon />, text: "Proteção do interior: bloqueia até 99,9% dos raios UV, retardando o desbotamento." },
      { icon: <SkinIcon />, text: "Proteção da pele: FPS superior a 1.700 — recomendada pela Skin Cancer Foundation." },
      { icon: <ColorIcon />, text: "Nunca muda de cor: garantia de 15 anos." },
    ],
  },
  {
    nome: "CS Premium",
    tag: "Visual de vidro colorido de fábrica",
    resumo: "Tecnologia de poliéster patenteada pela 3M nos Estados Unidos: excelente rejeição ao calor com um visual semelhante a um vidro colorido de fábrica.",
    vlt: [5, 50],
    specs: [
      { icon: <HeatIcon />, value: "57%", label: "calor rejeitado" },
      { icon: <UvIcon />, value: "99%", label: "UV bloqueado" },
      { icon: <WarrantyIcon />, value: "Vitalícia", label: "garantia de cor" },
    ],
    itens: [
      { icon: <GlareIcon />, text: "Redução do brilho solar: permite que apenas 5% a 50% da luz solar passe pelos vidros." },
      { icon: <HeatIcon />, text: "Melhora o conforto: rejeita até 57% do calor." },
      { icon: <SignalIcon />, text: "Nenhuma interferência de sinal de GPS e celular: não é metalizada." },
      { icon: <SkinIcon />, text: "Proteção do interior: bloqueia até 99% dos raios UV. FPS de até 1.000 — recomendada pela Skin Cancer Foundation." },
      { icon: <ColorIcon />, text: "O nome diz tudo: nunca muda de cor, garantida por toda a vida da película." },
    ],
  },
  {
    nome: "FX Pro",
    tag: "Econômica, qualidade 3M",
    resumo: "Produto econômico que oferece rejeição ao calor com a qualidade 3M e visual elegante.",
    vlt: [5, 70],
    specs: [
      { icon: <HeatIcon />, value: "46%", label: "calor rejeitado" },
      { icon: <UvIcon />, value: "99%", label: "UV bloqueado" },
      { icon: <SkinIcon />, value: "FPS 1.000", label: "proteção da pele" },
    ],
    itens: [
      { icon: <GlareIcon />, text: "Redução do brilho: películas fumês permitem que apenas 5% a 70% da luz solar passe." },
      { icon: <HeatIcon />, text: "Melhora o conforto: rejeita até 46% do calor." },
      { icon: <SignalIcon />, text: "Nenhuma interferência de sinal de GPS e celular: não é metalizada." },
      { icon: <SkinIcon />, text: "Proteção do interior: bloqueia até 99% dos raios UV. FPS de até 1.000 — recomendada pela Skin Cancer Foundation." },
    ],
  },
  {
    nome: "EX",
    tag: "Privacidade",
    resumo: "Solução para proprietários que querem apenas privacidade.",
    vlt: [5, 35],
    specs: [{ icon: <GlareIcon />, value: "5–35%", label: "de luz visível" }],
    itens: [
      { icon: <GlareIcon />, text: "Redução do brilho: películas fumês bloqueiam a luz que causa incômodo visual e permitem que apenas 5% a 35% da luz passe." },
    ],
  },
  {
    nome: "Black Chrome",
    tag: "Metalizada · visual único",
    resumo: "Tecnologia de películas metalizadas, com excelente rejeição ao calor, visual único e maior refletividade externa.",
    vlt: [10, 40],
    specs: [
      { icon: <HeatIcon />, value: "72%", label: "calor rejeitado" },
      { icon: <UvIcon />, value: "99%", label: "UV bloqueado" },
      { icon: <MirrorIcon />, value: "Metalizada", label: "refletividade externa" },
    ],
    itens: [
      { icon: <GlareIcon />, text: "Redução do reflexo: permite que apenas 10% a 40% da luz ingresse pela janela." },
      { icon: <HeatIcon />, text: "Melhoria do conforto: rejeita até 72% do calor." },
      { icon: <SkinIcon />, text: "Proteção do interior: bloqueia até 99% dos raios UV. FPS de até 1.000 — recomendada pela Skin Cancer Foundation." },
    ],
  },
];

/** Linhas da tabela comparativa: só o que está escrito nos itens acima. "—" = não informado. */
const comparativo: { k: string; v: (l: Linha) => string }[] = [
  { k: "Luz visível", v: (l) => `${l.vlt[0]}–${l.vlt[1]}%` },
  {
    k: "Calor rejeitado",
    v: (l) => ({ Crystalline: "até 60%", "CS Premium": "até 57%", "FX Pro": "até 46%", EX: "—", "Black Chrome": "até 72%" })[l.nome] ?? "—",
  },
  {
    k: "Raios UV",
    v: (l) => ({ Crystalline: "até 99,9%", "CS Premium": "até 99%", "FX Pro": "até 99%", EX: "—", "Black Chrome": "até 99%" })[l.nome] ?? "—",
  },
  {
    k: "FPS",
    v: (l) => ({ Crystalline: "> 1.700", "CS Premium": "até 1.000", "FX Pro": "até 1.000", EX: "—", "Black Chrome": "até 1.000" })[l.nome] ?? "—",
  },
  {
    k: "Metalizada",
    v: (l) => ({ Crystalline: "Não", "CS Premium": "Não", "FX Pro": "Não", EX: "—", "Black Chrome": "Sim" })[l.nome] ?? "—",
  },
  {
    k: "Garantia de cor",
    v: (l) => ({ Crystalline: "15 anos", "CS Premium": "Vitalícia", "FX Pro": "—", EX: "—", "Black Chrome": "—" })[l.nome] ?? "—",
  },
];

function VltBand({ range }: { range: [number, number] }) {
  return (
    <div>
      <div className="pel-band" style={{ "--from": `${range[0]}%`, "--to": `${range[1]}%` } as CSSProperties} role="img" aria-label={`Permite passar de ${range[0]}% a ${range[1]}% da luz visível`}>
        <span className="pel-band__range" />
      </div>
      <div className="pel-band-ticks" aria-hidden>
        <span>Escura · 0%</span>
        <span>50%</span>
        <span>100% · Clara</span>
      </div>
    </div>
  );
}

export default function TresMPage() {
  return (
    <>
      <PageHero
        eyebrow="Aplicadora credenciada 3M"
        title={
          <>
            Menos calor.
            <br />
            <span className="text-red-2">Mais proteção.</span>
          </>
        }
        intro="Melhoria do conforto e proteção do interior do veículo e dos seus ocupantes é uma marca registrada das Películas para Vidros da 3M linha automotiva. A 3M inventou as películas para vidros em 1966 e seus produtos vêm fornecendo proteção contra os raios solares há mais de 40 anos."
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
              prejudiciais do sol, as Películas para Vidros da 3M linha automotiva são a escolha
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
            A barra em cada card mostra a faixa de luz visível que a película deixa passar — quanto mais à esquerda, mais escura.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-4" stagger={0.1}>
          {linhas.map((l, i) => (
            <RevealItem key={l.nome} className="pel-card">
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
                  <VltBand range={l.vlt} />
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
          <Reveal delay={0.1} className="overflow-x-auto border border-line bg-bg/60">
            <table className="pel-table">
              <caption className="sr-only">Comparativo das películas 3M linha automotiva</caption>
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
          <p className="mt-3 text-xs text-fg-3">&ldquo;—&rdquo; = não informado no catálogo. Valores &ldquo;até&rdquo; conforme a 3M.</p>
          <div className="mt-8">
            <Callout icon={<AlertIcon />}>
              <strong className="text-fg">Nota:</strong> a legislação sobre a transparência de películas
              automotivas pode variar localmente. Consulte as legislações aplicáveis ou entre em contato
              conosco.
            </Callout>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
