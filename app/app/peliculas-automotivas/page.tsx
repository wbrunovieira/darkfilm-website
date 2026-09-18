import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Callout, Tiles } from "@/components/Section";
import { ContactCTA } from "@/components/ContactCTA";
import { TintSimulator } from "@/components/TintSimulator";
import { Tecnologias } from "@/components/peliculas/Tecnologias";
import { AlertIcon, CurveIcon, HeatIcon, LayersIcon } from "@/components/icons/peliculas";

export const metadata: Metadata = {
  title: "Películas Automotivas",
  description:
    "Películas automotivas profissionais em Petrópolis: 3M, Garware, Llumar, Ultra IR Pro e Window Blue. Conforto térmico, proteção UV e aplicação com acabamento.",
};

// Aqui existia `related`, com os dois produtos que a seção do fim oferecia: conserto de
// para-brisa e envelopamento. Saiu junto com a seção, a pedido do cliente em 12/09/2026. Os dois
// continuam acessíveis pelo menu e pelo catálogo, mas deixaram de ser oferecidos a quem está
// lendo sobre película — é o efeito colateral do pedido, e está registrado na issue.

// Texto copiado da página "Películas Automotivas" do site original.
export default function LinhaAutomotivaPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Início", href: "/" }, { label: "Películas" }, { label: "Automotivas" }]}
        title={
          <>
            Aplicação perfeita,
            <br />
            <span className="text-red-2">do material ao acabamento.</span>
          </>
        }
        intro="Trabalhamos com películas profissionais e de alta performance, com tecnologias que proporcionam maior conforto térmico, proteção UV, privacidade e excelente visibilidade. Tudo aliado a uma aplicação profissional, com cuidado no acabamento e mínima contaminação."
        /* Pedido do cliente em 12/09/2026: o Porsche Boxster preto no lugar do 2008 azul. É foto
           dele, na própria oficina, com o painel de fuscas em cima e o letreiro The Dark Film ao
           fundo — a loja aparece junto com o carro, que é o que a de antes não fazia.

           A placa dianteira estava legível e foi pixelada. As caixas foram medidas na versão de
           2000px que vai ao ar, não no original de 4080px: foi medindo no original que a placa do
           Peugeot escapou uma vez. Conferido ampliado depois de aplicar, e os carros ao fundo não
           mostram placa. */
        image="/img/novo/aplicacao-carros--porsche-boxster-oficina.jpg"
        imagePosition="center 58%"
      />

      {/* Os três argumentos do texto de abertura, em tiles. Os nomes das marcas são os que o
          cliente listou em 02/09/2026 — a loja é multimarca, e foi por isso que ele também
          mandou tirar a exclusividade 3M do simulador. */}
      <section className="pel-atmo border-t border-line">
        <div className="container-x py-14 md:py-20">
          <Tiles
            columns={3}
            items={[
              {
                icon: <LayersIcon />,
                title: "Películas profissionais",
                text: "Marcas reconhecidas — 3M, Garware, Llumar, Ultra IR Pro e Window Blue — de linhas tradicionais a películas de alta performance.",
              },
              {
                icon: <HeatIcon />,
                title: "Tecnologia e conforto térmico",
                text: "Opções com nanotecnologia e tecnologias avançadas para maior redução de calor e proteção UV.",
              },
              {
                icon: <CurveIcon />,
                title: "Aplicação e acabamento",
                text: "Instalação profissional, com técnica, cuidado nos detalhes e mínima contaminação.",
              },
            ]}
          />
        </div>
      </section>

      {/* Aqui ficava a seção da chancela ABRAWF, com o texto das resoluções, a tabela de
          limites por vidro e o mostruário de tonalidades. Saiu a pedido do cliente em
          02/09/2026: legislação passa a ser tratada só na página específica, e desta página
          os três quadros vão direto ao simulador, sem repetir informação.

          A chancela ABRAWF é diferencial real — a loja é a única de Petrópolis com ela — e
          está registrada como pergunta em aberto no painel de revisão: confirmar com ele se
          era a chancela que incomodava ou só o texto legal antigo que a acompanhava. */}

      <TintSimulator />

      {/* O aviso de legislação morava no fim da página, dentro da seção "Mais para o seu carro".
          Ele mandou tirar a seção em 12/09/2026; o aviso veio para cá em vez de sumir junto.
          Aqui é o lugar certo dele: fica encostado no simulador, que é justamente sobre o que a
          lei permite em cada vidro, e é a parte que o cliente elogiou. Os dois links continuam
          sendo o caminho desta página para /simulador e /caracteristicas-do-film. */}
      <div className="container-x pb-16 md:pb-20">
        <Callout icon={<AlertIcon />}>
          Consulte a legislação vigente para a transparência mínima de cada vidro. Na loja
          medimos o valor final com equipamento próprio — veja também{" "}
          <Link href="/simulador" className="text-fg underline underline-offset-4 hover:text-red-2">o que a lei permite em cada vidro</Link>{" "}
          e as{" "}
          <Link href="/caracteristicas-do-film" className="text-fg underline underline-offset-4 hover:text-red-2">características do film</Link>.
        </Callout>
      </div>

      {/* Aqui morava o bloco "Película automotiva de proteção e segurança", com o comparativo
          sem/com, o dado dos cinco segundos, a foto do vidro estilhaçado e duas listas sobre
          acidente e arrombamento. Saiu a pedido do cliente em 12/09/2026: "substituir o conteúdo
          atual, hoje muito concentrado em película de segurança, por uma apresentação mais
          completa das tecnologias".

          Ele tem razão no diagnóstico — a página vendia uma tecnologia só. Mas o que saiu era o
          material mais persuasivo da página, e isso está registrado na issue: se a conversão cair,
          o caminho é trazer o comparativo e o dado dos cinco segundos de volta, agora ancorados no
          cartão de segurança, sem voltar a dominar a página. */}
      <Tecnologias />

      <ContactCTA />
    </>
  );
}
