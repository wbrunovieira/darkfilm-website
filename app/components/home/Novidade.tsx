import Image from "next/image";
import { Reveal } from "../Reveal";
import { MeterIcon } from "../icons/home";

// Texto e imagens copiados do bloco "Novidade!!!" da home original.
export function Novidade() {
  return (
    <section className="atmo atmo-right overflow-hidden py-24 md:py-32">
      <div className="container-x">
        <div className="grid overflow-hidden rounded-lg border border-line bg-bg-2 md:grid-cols-[1.1fr_1fr]">
          <Reveal className="relative p-8 md:p-14">
            <span aria-hidden className="num-ghost absolute right-6 top-6 text-6xl md:text-7xl">
              +
            </span>
            <p className="eyebrow mb-4 flex items-center gap-2">
              <MeterIcon className="size-4" />
              Novidade
            </p>
            <h2 className="display text-4xl md:text-5xl">
              Medimos a transmissão luminosa do film<span className="text-red-2">.</span>
            </h2>
            <p className="mt-5 max-w-md text-fg-2">
              Faça-nos uma visita e conheça o equipamento utilizado para medir a transmissão
              luminosa do filme. A The Dark Film & Sound mais uma vez inova e lança a película de
              segurança.
            </p>
          </Reveal>

          {/* Fotos de produto vêm com fundo branco: painel claro assumido como "vitrine". */}
          <Reveal
            delay={0.15}
            className="relative flex items-center justify-center gap-6 bg-[radial-gradient(90%_80%_at_50%_0%,#ffffff_0%,#e9e7e2_100%)] p-8 md:p-12"
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red to-transparent md:inset-y-0 md:left-0 md:h-auto md:w-px md:bg-gradient-to-b" />
            <Image
              src="/img/marca/pocket-detective.jpg"
              alt="Medidor Pocket Detective"
              width={260}
              height={200}
              className="h-40 w-auto mix-blend-multiply transition-transform duration-700 ease-out-expo hover:-translate-y-1 md:h-56"
            />
            <Image
              src="/img/marca/tint-meter.jpg"
              alt="Tint Meter Enforcer TM100"
              width={160}
              height={260}
              className="h-40 w-auto mix-blend-multiply transition-transform duration-700 ease-out-expo hover:-translate-y-1 md:h-56"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
