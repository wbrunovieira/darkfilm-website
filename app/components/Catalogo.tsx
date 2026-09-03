"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { grupos, grupoDe, type Produto } from "@/lib/produtos";
import { whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import { ChevronSmallIcon, CloseIcon, GrupoIcon, SearchIcon } from "./icons/catalogo";

const ease = [0.16, 1, 0.3, 1] as const;

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function Catalogo({ items }: { items: Produto[] }) {
  /**
   * Filtro e busca ficam refletidos na URL, mas o ESTADO é local.
   *
   * O problema original: com estado só local, filtrar "Iluminação" (5 itens), abrir um produto
   * e voltar devolvia a lista em "Todos" (41 itens) — com o scroll restaurado na mesma altura,
   * a tela apontando para produtos completamente diferentes. Era o momento literal do "cada
   * hora clico num link e não sei onde estou" que o cliente relatou.
   *
   * A primeira tentativa foi ler direto de `useSearchParams`. Funcionou para o Voltar e quebrou
   * outra coisa: isso tira o componente da pré-renderização estática, e os 41 links de produto
   * sumiram do HTML publicado — justamente a página que é a porta de entrada para as 45 páginas
   * de produto. Conferido no build: 41 links no HTML servido em dev, 0 no estático.
   *
   * Por isso o desenho é este: o servidor renderiza a lista inteira (crawlable), e a URL é
   * espelho do estado, lida uma vez na montagem. Voltar remonta o componente e o filtro volta.
   */
  const [grupo, setGrupoState] = useState<string>("todos");
  const [q, setQState] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setGrupoState(p.get("grupo") ?? "todos");
    setQState(p.get("q") ?? "");
  }, []);

  /**
   * Espelha na URL sem passar pelo roteador.
   *
   * Com `router.replace` cada tecla digitada na busca disparava uma requisição do payload
   * inteiro da página — e sem propósito, já que o componente lê a URL só na montagem. Num
   * celular em rede lenta eram cinco downloads de 41 produtos enquanto a pessoa escrevia
   * "xenon". `history.replaceState` faz o mesmo espelho com zero rede.
   */
  const espelhar = useCallback((proxGrupo: string, proxQ: string) => {
    const p = new URLSearchParams(window.location.search);
    if (proxGrupo === "todos") p.delete("grupo");
    else p.set("grupo", proxGrupo);
    if (!proxQ) p.delete("q");
    else p.set("q", proxQ);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, []);

  /**
   * Um aplicador só, com os DOIS valores. Antes eram `setGrupo` e `setQ` separados, cada um
   * fechando sobre o outro valor: "Limpar filtros" chamava os dois em sequência e o segundo
   * espelhava o `q` antigo, deixando a URL com uma busca que a tela não mostrava mais — e o
   * F5 ressuscitava o filtro fantasma.
   */
  const aplicar = useCallback(
    (proxGrupo: string, proxQ: string) => {
      setGrupoState(proxGrupo);
      setQState(proxQ);
      espelhar(proxGrupo, proxQ);
    },
    [espelhar],
  );

  const counts = useMemo(() => {
    const m: Record<string, number> = { todos: items.length };
    for (const g of grupos) m[g.id] = items.filter((p) => g.slugs.includes(p.slug)).length;
    return m;
  }, [items]);

  const list = useMemo(() => {
    const slugs = grupo === "todos" ? null : new Set(grupos.find((g) => g.id === grupo)?.slugs);
    const nq = normalize(q.trim());
    return items.filter(
      (p) =>
        (!slugs || slugs.has(p.slug)) &&
        (!nq || normalize(p.title + " " + p.subtitle + " " + p.description).includes(nq)),
    );
  }, [items, grupo, q]);

  const tabs = [{ id: "todos", nome: "Todos" }, ...grupos];
  const grupoNome = tabs.find((t) => t.id === grupo)?.nome ?? "Todos";

  return (
    <div>
      {/* Grupos */}
      <div role="tablist" aria-label="Grupos do catálogo" className="cat-groups">
        {tabs.map((g) => {
          const selected = grupo === g.id;
          return (
            <button
              key={g.id}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="catalogo-lista"
              onClick={() => aplicar(g.id, q)}
              className="cat-group"
            >
              {selected && (
                <motion.span
                  layoutId="cat-group-glow"
                  className="cat-group__glow"
                  transition={{ duration: 0.5, ease }}
                />
              )}
              <span className="flex w-full items-start">
                <GrupoIcon id={g.id} className="cat-group__icon" />
                <span className="cat-group__count">{String(counts[g.id] ?? 0).padStart(2, "0")}</span>
              </span>
              <span className="cat-group__name">{g.nome}</span>
              {selected && (
                <motion.span
                  layoutId="cat-group-bar"
                  className="cat-group__bar"
                  transition={{ type: "spring", stiffness: 420, damping: 40 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Busca + contagem */}
      <div className="mt-8 flex flex-col gap-4 md:mt-10 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-fg-3" aria-live="polite">
          <span className="text-fg">{String(list.length).padStart(2, "0")}</span>{" "}
          {list.length === 1 ? "item" : "itens"}
          {grupo !== "todos" && <> · {grupoNome}</>}
          {q.trim() && <> · &ldquo;{q.trim()}&rdquo;</>}
        </p>
        <label className="cat-search md:w-80">
          <span className="sr-only">Buscar no catálogo</span>
          <SearchIcon className="cat-search__icon" />
          <input
            type="search"
            value={q}
            onChange={(e) => aplicar(grupo, e.target.value)}
            placeholder="Buscar: alarme, xenon, engate…"
            autoComplete="off"
          />
          {q && (
            <button type="button" onClick={() => aplicar(grupo, "")} aria-label="Limpar busca" className="cat-search__clear">
              <CloseIcon className="size-4" />
            </button>
          )}
        </label>
      </div>

      {/* Lista */}
      <motion.ul
        layout
        id="catalogo-lista"
        role="tabpanel"
        aria-label={grupoNome}
        className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => {
            const g = grupoDe(p.slug);
            return (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease, delay: Math.min(i, 10) * 0.025 }}
              >
                <Link href={`/produtos/${p.slug}`} className="cat-card">
                  <div className="cat-card__media">
                    {g && (
                      <span className="cat-card__tag">
                        <GrupoIcon id={g.id} />
                        {g.nome}
                      </span>
                    )}
                    {p.photos[0] && (
                      <Image
                        src={p.photos[0].src}
                        alt={p.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        className="object-contain p-5"
                      />
                    )}
                  </div>
                  <div className="cat-card__body">
                    <div>
                      <h3 className="cat-card__title">{p.title}</h3>
                      {p.photos.length > 1 && (
                        <span className="cat-card__hint">{p.photos.length} fotos</span>
                      )}
                    </div>
                    <span className="cat-card__arrow" aria-hidden>
                      <ChevronSmallIcon className="size-4" />
                    </span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {list.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="cat-empty"
        >
          <span className="cat-empty__icon">
            <SearchIcon className="size-6" />
          </span>
          <div>
            <p className="display text-2xl md:text-3xl">Nada com &ldquo;{q.trim()}&rdquo;</p>
            <p className="mx-auto mt-3 max-w-md text-fg-2">
              Trabalhamos com toda linha de equipamentos nacionais e importados. Se não está no catálogo,
              pergunte pelo WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={whatsappUrl(`Olá! Procuro: ${q.trim()}. Vocês trabalham com isso?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta !min-h-12 !text-sm"
            >
              <WhatsAppIcon className="size-4" />
              Perguntar no WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                aplicar("todos", "");
              }}
              className="inline-flex min-h-12 items-center rounded-full border border-line-strong px-5 font-display text-sm font-semibold uppercase tracking-[0.16em] text-fg-2 transition-colors hover:border-fg-3 hover:text-fg"
            >
              Limpar filtros
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
