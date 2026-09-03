"use client";

import { useState, type SVGProps } from "react";
import { Reveal } from "../Reveal";
import { ArrowIcon } from "../icons";
import { SoundIcon } from "../icons/home";

/* Playlist da conta do próprio cliente, enviada por ele em 02/09/2026. A anterior era uma
   playlist da WB, usada só como exemplo enquanto ele não escolhia a dele.

   O "código de incorporação" do Spotify não precisa ser copiado do site deles: é o mesmo
   endereço da playlist com `/embed/` no meio. E ela precisa continuar PÚBLICA — se virar
   privada, o quadro aparece vazio para quem não segue, sem erro nenhum na tela. */
const PLAYLIST_URL = "https://open.spotify.com/playlist/6ivosCzSh5uFib5WHsxqLq";
const EMBED_SRC =
  "https://open.spotify.com/embed/playlist/6ivosCzSh5uFib5WHsxqLq?utm_source=generator";

/** Nome real da playlist na conta do cliente (via oEmbed da Spotify). */
const PLAYLIST_NAME = "Rolé";

/** Altura do embed da Spotify; a fachada usa a mesma para não haver salto no layout. */
const PLAYER_HEIGHT = 352;

function PlayIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M8 5.14v13.72L19 12 8 5.14Z" />
    </svg>
  );
}

/**
 * Playlist da The Dark Film no Spotify, no fim da home.
 *
 * O iframe não é montado no carregamento da página: a fachada é nossa e o player só entra
 * quando o visitante clica. Isso mantém o bundle e os cookies do open.spotify.com fora de
 * quem só quer ver o site, e o embed longe do caminho do LCP.
 */
export function Playlist() {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <section className="atmo atmo-soft overflow-hidden py-24 md:py-32">
      <div className="container-x">
        <div className="grid items-center gap-10 overflow-hidden rounded-lg border border-line bg-bg-2 p-8 md:grid-cols-[1fr_1.05fr] md:gap-14 md:p-14">
          <Reveal className="relative">
            <p className="eyebrow mb-4 flex items-center gap-2">
              <SoundIcon className="size-4" />
              &amp; Sound
            </p>
            <h2 className="display text-4xl md:text-5xl">
              Som é a outra metade do nome<span className="text-red-2">.</span>
            </h2>
            <p className="mt-5 max-w-md text-fg-2">
              A nossa playlist no Spotify. Dê o play aqui ou abra no aplicativo e deixe tocando
              enquanto vê o resto do site.
            </p>
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-grow mt-8 inline-flex w-fit items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-fg"
            >
              Abrir no Spotify
              <ArrowIcon className="size-4" />
            </a>
          </Reveal>

          <Reveal delay={0.15}>
            {showPlayer ? (
              <iframe
                title={`Playlist ${PLAYLIST_NAME} da The Dark Film & Sound no Spotify`}
                src={EMBED_SRC}
                width="100%"
                height={PLAYER_HEIGHT}
                loading="lazy"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="block w-full rounded-xl border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowPlayer(true)}
                aria-label={`Carregar o player do Spotify e ouvir a playlist ${PLAYLIST_NAME}`}
                style={{ height: PLAYER_HEIGHT }}
                className="group relative flex w-full flex-col items-center justify-center gap-6 rounded-xl border border-line-strong bg-bg-3 transition-colors duration-500 hover:border-red/50"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(60%_60%_at_50%_42%,rgba(209,20,31,0.2),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="relative flex size-16 items-center justify-center rounded-full bg-red text-white shadow-[0_20px_40px_-20px_rgba(209,20,31,0.9)] transition-transform duration-500 ease-out-expo group-hover:scale-110">
                  <PlayIcon className="ml-1 size-6" />
                </span>
                <span className="relative text-center">
                  <span className="block font-display text-xl font-semibold uppercase tracking-[0.12em] text-fg">
                    {PLAYLIST_NAME}
                  </span>
                  <span className="mt-1 block text-sm text-fg-3">Playlist no Spotify · toque para ouvir</span>
                </span>
              </button>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
