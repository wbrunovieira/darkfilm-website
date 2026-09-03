import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * As páginas de película mudaram de endereço em 03/09/2026, junto com a troca de
   * nome pedida pelo cliente: "linha" era jargão de dentro da oficina, "películas" é
   * o que o cliente final procura.
   *
   * O momento é o certo: o site vive num domínio de proposta com `noindex`, então
   * nenhuma dessas URLs foi indexada ainda. O redirecionamento existe para o que já
   * possa estar anotado ou linkado por fora — e é permanente (308), que é o que diz
   * ao Google que o endereço novo é o definitivo.
   */
  async redirects() {
    return [
      { source: "/linha-automotiva", destination: "/peliculas-automotivas", permanent: true },
      { source: "/linha-arquitetonica", destination: "/peliculas-arquitetonicas", permanent: true },
      /* /produtos respondia 404 embora o breadcrumb das 45 páginas de produto sugira que esse
         nível existe. Quem edita a URL na barra, ou segue a lógica do rastro, caía num erro.
         O catálogo mora em /som-e-acessorios. */
      { source: "/produtos", destination: "/som-e-acessorios", permanent: true },
    ];
  },
};

export default nextConfig;
