"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * As três credenciais no alto da home, no lugar das placas decorativas.
 *
 * Pedido do cliente em 12/09/2026: ele quer que quem abre o site veja 3M, Mercado Livre e Thule
 * antes de rolar a página, porque são as três credenciais que ele considera mais importantes.
 *
 * **Os logos são vetores oficiais**, não reprodução nossa: vieram do Wikimedia Commons, que
 * hospeda as marcas registradas dessas três empresas. Ficam em `public/img/marcas/`.
 *
 * Duas precisaram de variante para fundo escuro, o que é uso previsto em qualquer manual de marca:
 * o Mercado Livre é azul-escuro e o Thule é preto, os dois somem no nosso hero. Foram passados
 * para branco trocando a cor de preenchimento do vetor, sem alterar desenho nem proporção. O 3M
 * foi usado como veio, porque o vermelho dele já contrasta.
 *
 * O selo do Thule que o cliente mandou por WhatsApp traz "REVENDA AUTORIZADA" embutido na imagem.
 * Não foi usado: aqui a credencial vai em texto, igual para as três, o que mantém o conjunto
 * alinhado e deixa a frase editável sem mexer em imagem.
 *
 * Os três ficam sobre um painel escuro translúcido, como no desenho que ele mandou. Serve a duas
 * coisas: garante leitura sobre a foto do hero, que muda de claridade conforme a área, e acomoda
 * o logo do Mercado Livre, que é o único em bitmap e traz o próprio fundo escuro.
 */

type Credencial = {
  marca: string;
  logo: string;
  /** Proporção do vetor, para o `next/image` reservar o espaço e não sacudir o layout. */
  w: number;
  h: number;
  /** A linha que diz o que a loja é para aquela marca. */
  papel: string;
  /** Destino. `null` enquanto a página não existir: o item vira texto, não link morto. */
  href: string | null;
};

const CREDENCIAIS: Credencial[] = [
  { marca: "3M", logo: "/img/marcas/3m.svg", w: 77, h: 40, papel: "Aplicador credenciado", href: "/3m" },
  // A do Thule ainda não existe: ele pediu as duas seções em 12/09 e essa segue na fila. Item
  // sem destino aparece como texto, em vez de levar a lugar nenhum.
  // O único que não é vetor: o Commons só tem o logo antigo, de antes do rebranding, e o
  // símbolo do aperto de mão não está lá. Este saiu da arte que o próprio cliente mandou. Como
  // aparece com 28px de altura, entra reduzido e não ampliado, então o tamanho basta.
  { marca: "Mercado Livre", logo: "/img/marcas/mercado-livre.png", w: 288, h: 72, papel: "Agência autorizada", href: "/agencia-mercado-livre" },
  { marca: "Thule", logo: "/img/marcas/thule.svg", w: 155, h: 40, papel: "Revenda autorizada", href: null },
];

/**
 * Versão do topo à direita, a partir de `md`. Sobe devagar com a rolagem, como as placas faziam.
 */
export function Credenciais() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -60]);
  const opacity = useTransform(scrollY, [0, 380], [1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.55, ease }}
      className="absolute right-4 top-24 z-10 hidden rounded-lg border border-line bg-bg/65 px-4 py-3 backdrop-blur md:top-28 md:block lg:right-8 lg:top-32"
      aria-label="Credenciais da loja"
    >
      <ul className="flex items-stretch">
        {CREDENCIAIS.map((c, i) => (
          <li key={c.marca} className={i > 0 ? "border-l border-line-strong pl-4 md:pl-5" : ""}>
            <Item c={c} />
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/**
 * Versão do celular, no fluxo e logo acima do título.
 *
 * Existe porque o pedido dele é que as três credenciais apareçam antes de a pessoa rolar, e é no
 * celular que a maioria entra. A versão da direita não cabe numa tela estreita, então aqui a linha
 * é mais compacta e ocupa o vão que as placas deixaram no alto.
 */
export function CredenciaisMobile() {
  return (
    <motion.ul
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.45, ease }}
      className="mb-6 flex items-stretch rounded-lg border border-line bg-bg/65 px-3 py-3 backdrop-blur md:hidden"
      aria-label="Credenciais da loja"
    >
      {CREDENCIAIS.map((c, i) => (
        <li key={c.marca} className={`min-w-0 flex-1 ${i > 0 ? "border-l border-line pl-3" : ""}`}>
          <Item c={c} compacto />
        </li>
      ))}
    </motion.ul>
  );
}

function Item({ c, compacto }: { c: Credencial; compacto?: boolean }) {
  const alturaLogo = compacto ? "h-4" : "h-6 md:h-7";
  const miolo = (
    <>
      <Image
        src={c.logo}
        alt={c.marca}
        width={c.w}
        height={c.h}
        className={`${alturaLogo} w-auto`}
      />
      <span
        className={`mt-1 block font-display font-semibold uppercase leading-tight tracking-[0.1em] text-fg-3 ${
          compacto ? "text-[0.5rem]" : "mt-1.5 max-w-[7.5rem] text-[0.6rem] tracking-[0.14em]"
        }`}
      >
        {c.papel}
      </span>
    </>
  );

  const espaco = compacto ? "pr-2" : "pr-4 md:pr-5";

  if (!c.href) {
    return <span className={`block ${espaco}`}>{miolo}</span>;
  }

  return (
    <Link
      href={c.href}
      className={`group block ${espaco} transition-opacity duration-300 hover:opacity-100 md:opacity-85`}
    >
      {miolo}
      <span
        aria-hidden
        className="mt-2 block h-px w-0 bg-red-2 transition-all duration-300 group-hover:w-full"
      />
    </Link>
  );
}
