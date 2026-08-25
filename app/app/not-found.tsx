import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col justify-center py-32">
      <p className="eyebrow mb-4">Erro 404</p>
      <h1 className="display text-6xl md:text-8xl">
        Página não <span className="text-red-2">encontrada.</span>
      </h1>
      <p className="mt-6 max-w-md text-fg-2">
        O endereço pode ter mudado com o site novo. Volte para o início ou veja o catálogo.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-red px-6 py-3 font-display font-semibold uppercase tracking-[0.14em] text-white hover:bg-red-2">
          Início <ArrowIcon className="size-4" />
        </Link>
        <Link href="/som-e-acessorios" className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-display font-semibold uppercase tracking-[0.14em] text-fg-2 hover:border-red hover:text-fg">
          Som e acessórios
        </Link>
      </div>
    </section>
  );
}
