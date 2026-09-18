"use client";

import { useId, useState } from "react";
import { LIMITES, type VidroId } from "@/lib/legislacao";
import { CARRO_FRONTAL, CARRO_PERFIL } from "./carros";
import { CarroFoto } from "./CarroFoto";

/**
 * As duas opções de carro para o passo 1 do simulador, lado a lado, ambas clicáveis.
 *
 * Existe porque cinco tentativas de redesenhar o carro foram reprovadas pelo cliente entre 10 e
 * 18/09/2026 — "quadrado", "deformado", "amassado atrás", "ainda distorcido", "piorou muito".
 * Em vez de uma sexta rodada, a decisão passou para ele: manter o desenho, contratar um
 * ilustrador, ou trocar por foto. E para decidir ele precisa **experimentar**, não olhar print.
 *
 * As duas variantes compartilham a mesma escolha de vidro de propósito: tocar num vidro de um
 * carro acende o mesmo vidro no outro. É o que deixa claro que a mudança é de aparência, e que o
 * funcionamento do simulador não muda em nenhuma das duas.
 *
 * Quando ele escolher, esta página sai do ar e o vencedor vira o diagrama do simulador.
 */

const VIDRO_DO_POLIGONO: Record<string, VidroId> = {
  parabrisa: "parabrisa",
  dianteiro: "dianteiras",
  traseiro: "traseiras",
  vigia: "traseiras",
};

function Quadro({
  vidro,
  onPick,
  children,
}: {
  vidro: VidroId;
  onPick: (v: VidroId) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="carro-diagrama w-full"
      data-sel={vidro}
      onClick={(e) => {
        const alvo = (e.target as HTMLElement).closest?.("[data-vidro]");
        const chave = alvo?.getAttribute("data-vidro");
        const destino = chave ? VIDRO_DO_POLIGONO[chave] : undefined;
        if (destino) onPick(destino);
      }}
    >
      {children}
    </div>
  );
}

function Opcao({
  etiqueta,
  titulo,
  texto,
  children,
}: {
  etiqueta: string;
  titulo: string;
  texto: string;
  children: React.ReactNode;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-line bg-bg-2 p-5 md:p-6">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-red-2">{etiqueta}</p>
      <h2 className="mt-1.5 font-display text-xl font-semibold uppercase leading-tight md:text-2xl">
        {titulo}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-fg-2">{texto}</p>
      <div className="mt-5 flex flex-1 items-center rounded-md border border-line bg-bg px-2 py-2">
        {children}
      </div>
    </article>
  );
}

export function EscolhaDoCarro() {
  const [vidro, setVidro] = useState<VidroId>("traseiras");
  const id = useId();

  return (
    <div className="container-x pb-16 pt-32 md:pb-24 md:pt-40">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-fg-3">
        The Dark Film · escolha do carro do simulador
      </p>
      <h1 className="display mt-3 text-3xl md:text-5xl">
        Duas opções para o <span className="text-red-2">carro do simulador.</span>
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-fg-2">
        Tentamos cinco versões do desenho e nenhuma ficou boa o bastante. Em vez de insistir, aqui
        estão as duas saídas para você comparar — e nas duas o simulador funciona igual.{" "}
        <strong className="text-fg">Toque nos vidros dos dois carros.</strong> O vidro que você
        escolher acende nos dois ao mesmo tempo.
      </p>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <Opcao
          etiqueta="Opção A"
          titulo="O desenho de hoje"
          texto="É o que está no ar. O mesmo que você achou quadrado e amassado atrás. Para mudar isso de verdade, o caminho é contratar um ilustrador."
        >
          {/* `carro-grande` solta o teto de 240 px que o diagrama tem dentro do simulador.
              Aqui os dois carros precisam ocupar a mesma largura, senão a comparação fica
              injusta: o desenho apareceria em miniatura ao lado da foto. */}
          <Quadro vidro={vidro} onPick={setVidro}>
            <div
              className="carro-grande w-full"
              dangerouslySetInnerHTML={{
                __html: vidro === "parabrisa" ? CARRO_FRONTAL : CARRO_PERFIL,
              }}
            />
          </Quadro>
        </Opcao>

        <Opcao
          etiqueta="Opção B"
          titulo="Foto da sua oficina"
          texto="O seu Fiat Abarth, fotografado aí dentro, com as placas The Dark Film ao fundo. Carro de verdade, proporcional, e os vidros continuam clicáveis."
        >
          <Quadro vidro={vidro} onPick={setVidro}>
            <CarroFoto />
          </Quadro>
        </Opcao>
      </div>

      {/* A lista continua aqui porque é ela o controle de verdade no simulador: o carro é atalho.
          Serve também para quem abrir isto no celular e achar o vidro pequeno demais para o dedo. */}
      <fieldset className="mt-8 max-w-xl">
        <legend className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.12em] text-fg">
          Ou escolha o vidro pela lista
        </legend>
        <div className="grid gap-2">
          {LIMITES.map((v) => {
            const active = vidro === v.id;
            return (
              <label
                key={v.id}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3.5 py-2.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-red ${
                  active
                    ? "border-red bg-red/10 text-fg"
                    : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
                }`}
              >
                <input
                  type="radio"
                  name={`${id}-vidro`}
                  value={v.id}
                  checked={active}
                  onChange={() => setVidro(v.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`size-3.5 shrink-0 rounded-full border-2 ${active ? "border-red bg-red" : "border-fg-3"}`}
                />
                <span className="min-w-0 leading-snug">{v.nome}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <aside className="mt-10 max-w-3xl rounded-xl border border-line-strong bg-bg-2 p-6 md:p-8">
        <h2 className="font-display text-lg font-semibold uppercase leading-tight">
          Uma observação sobre a foto
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fg-2">
          A placa do carro foi apagada de propósito, e o mesmo vale para uma pessoa que aparecia ao
          fundo. Se preferir outro carro, é rápido: precisa ser de quatro portas, de cor clara, com
          os vidros ainda sem película, fotografado um pouco de lado e um pouco de frente, o carro
          inteiro no quadro, com o celular deitado. Cinco minutos aí na oficina — e é a mesma ida em
          que dá para tirar a foto de dentro do carro que falta no último passo do simulador.
        </p>
      </aside>
    </div>
  );
}
