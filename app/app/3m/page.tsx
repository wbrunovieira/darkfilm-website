import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Bullets, Stat } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "Credenciada 3M",
  description:
    "Aplicadora credenciada 3M em Petrópolis. Películas para vidros 3M linha automotiva: Crystalline, CS Premium, FX Pro, EX e Black Chrome. Menos calor, mais proteção.",
};

// Conteúdo copiado da página "3M" do site original (catálogo de películas 3M).
const linhas = [
  {
    nome: "Crystalline",
    tag: "Transparente · alta tecnologia",
    resumo: "A mais alta tecnologia em películas transparentes com excelente rejeição ao calor. Perfeita para todos os veículos, inclusive para uso em para-brisa.",
    itens: [
      "Mantém a aparência original do veículo: tonalidade levemente colorida permite que 40% a 90% da luz solar entre pelo vidro.",
      "Melhora o conforto: rejeita até 97% dos raios infravermelhos e até 60% do calor solar.",
      "Nenhuma interferência de sinal de GPS e celular: não é metalizada.",
      "Proteção do interior: bloqueia até 99,9% dos raios UV, retardando o desbotamento.",
      "Proteção da pele: FPS superior a 1.700 — recomendada pela Skin Cancer Foundation.",
      "Nunca muda de cor: garantia de 15 anos.",
    ],
  },
  {
    nome: "CS Premium",
    tag: "Visual de vidro colorido de fábrica",
    resumo: "Tecnologia de poliéster patenteada pela 3M nos Estados Unidos: excelente rejeição ao calor com um visual semelhante a um vidro colorido de fábrica.",
    itens: [
      "Redução do brilho solar: permite que apenas 5% a 50% da luz solar passe pelos vidros.",
      "Melhora o conforto: rejeita até 57% do calor.",
      "Nenhuma interferência de sinal de GPS e celular: não é metalizada.",
      "Proteção do interior: bloqueia até 99% dos raios UV. FPS de até 1.000 — recomendada pela Skin Cancer Foundation.",
      "O nome diz tudo: nunca muda de cor, garantida por toda a vida da película.",
    ],
  },
  {
    nome: "FX Pro",
    tag: "Econômica, qualidade 3M",
    resumo: "Produto econômico que oferece rejeição ao calor com a qualidade 3M e visual elegante.",
    itens: [
      "Redução do brilho: películas fumês permitem que apenas 5% a 70% da luz solar passe.",
      "Melhora o conforto: rejeita até 46% do calor.",
      "Nenhuma interferência de sinal de GPS e celular: não é metalizada.",
      "Proteção do interior: bloqueia até 99% dos raios UV. FPS de até 1.000 — recomendada pela Skin Cancer Foundation.",
    ],
  },
  {
    nome: "EX",
    tag: "Privacidade",
    resumo: "Solução para proprietários que querem apenas privacidade.",
    itens: [
      "Redução do brilho: películas fumês bloqueiam a luz que causa incômodo visual e permitem que apenas 5% a 35% da luz passe.",
    ],
  },
  {
    nome: "Black Chrome",
    tag: "Metalizada · visual único",
    resumo: "Tecnologia de películas metalizadas, com excelente rejeição ao calor, visual único e maior refletividade externa.",
    itens: [
      "Redução do reflexo: permite que apenas 10% a 40% da luz ingresse pela janela.",
      "Melhoria do conforto: rejeita até 72% do calor.",
      "Proteção do interior: bloqueia até 99% dos raios UV. FPS de até 1.000 — recomendada pela Skin Cancer Foundation.",
    ],
  },
];

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
        intro="Melhoria do conforto e proteção do interior do veículo e dos seus ocupantes é uma marca registrada das Películas para Vidros da 3M da Linha Automotiva. A 3M inventou as películas para vidros em 1966 e seus produtos vêm fornecendo proteção contra os raios solares há mais de 40 anos."
        image="/img/peliculas/imgMostruarioFilm.jpg"
      />

      <section className="container-x grid gap-10 border-t border-line py-16 md:grid-cols-[1.4fr_1fr] md:gap-16 md:py-24">
        <Reveal className="prose-dark">
          <p>
            Se você procura alta tecnologia para a redução do calor ou para minimizar os efeitos
            prejudiciais do sol, as Películas para Vidros da 3M da Linha Automotiva são a escolha
            ideal. Ainda que estilo e conforto sejam fundamentais, as opções de películas não
            metalizadas ajudam você a permanecer conectado e protegido com um fator de proteção
            solar (FPS) superior a 1.000. Coloque a inovação da 3M para trabalhar para você.
          </p>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1">
          <Reveal><Stat value="1966" label="Ano em que a 3M inventou as películas para vidros" /></Reveal>
          <Reveal delay={0.1}><Stat value="FPS 1.000+" label="Fator de proteção solar das películas não metalizadas" /></Reveal>
        </div>
      </section>

      <section className="container-x border-t border-line py-16 md:py-24">
        <Reveal className="mb-12">
          <p className="eyebrow mb-3">Linha automotiva 3M</p>
          <h2 className="display text-3xl md:text-5xl">Cinco películas, cinco propósitos.</h2>
        </Reveal>
        <RevealGroup className="grid gap-4">
          {linhas.map((l, i) => (
            <RevealItem key={l.nome} className="grid gap-6 rounded-lg border border-line bg-bg-2 p-6 md:grid-cols-[220px_1fr] md:gap-12 md:p-10">
              <div>
                <p className="font-display text-sm text-fg-3">0{i + 1}</p>
                <h3 className="display mt-2 text-3xl md:text-4xl">
                  3M <span className="text-red-2">{l.nome}</span>
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-fg-3">{l.tag}</p>
              </div>
              <div className="prose-dark">
                <p>{l.resumo}</p>
                <Bullets items={l.itens} />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-8 rounded-md border border-line-strong p-5 text-sm text-fg-2">
          <strong className="text-fg">Nota:</strong> a legislação sobre a transparência de películas
          automotivas pode variar localmente. Consulte as legislações aplicáveis ou entre em contato
          conosco.
        </Reveal>
      </section>

      <ContactCTA />
    </>
  );
}
