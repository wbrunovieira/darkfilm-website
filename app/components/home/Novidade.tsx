import Image from "next/image";
import { Reveal } from "../Reveal";

// Texto e imagens copiados do bloco "Novidade!!!" da home original.
export function Novidade() {
  return (
    <section className="container-x py-24 md:py-32">
      <div className="grid gap-10 overflow-hidden rounded-lg border border-line bg-bg-2 md:grid-cols-2">
        <Reveal className="p-8 md:p-14">
          <p className="eyebrow mb-4">Novidade</p>
          <h2 className="display text-4xl md:text-5xl">
            Medimos a transmissão luminosa do film.
          </h2>
          <p className="mt-5 text-fg-2">
            Faça-nos uma visita e conheça o equipamento utilizado para medir a transmissão
            luminosa do filme. A The Dark Film & Sound mais uma vez inova e lança a película de
            segurança.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="relative flex items-center justify-center gap-6 bg-white p-8 md:p-12">
          <Image src="/img/marca/pocket-detective.jpg" alt="Medidor Pocket Detective" width={260} height={200} className="h-40 w-auto md:h-56" />
          <Image src="/img/marca/tint-meter.jpg" alt="Tint Meter Enforcer TM100" width={160} height={260} className="h-40 w-auto md:h-56" />
        </Reveal>
      </div>
    </section>
  );
}
