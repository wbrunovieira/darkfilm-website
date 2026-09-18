import Image from "next/image";

/**
 * Variante em foto do diagrama do carro.
 *
 * A foto é o Fiat Fastback Abarth do cliente, fotografado na própria oficina, com as placas
 * The Dark Film ao fundo. Vista 3/4 frontal, que é o enquadramento que mostra os três grupos
 * de vidro de que o simulador precisa ao mesmo tempo: para-brisa, porta dianteira e porta
 * traseira. Num perfil puro o para-brisa some atrás da coluna A — é por isso que o desenho
 * vetorial precisa de duas vistas.
 *
 * Já tratada antes de entrar no repositório: placa pixelada e o topo de uma cabeça, que
 * aparecia atrás do teto, borrado.
 *
 * Os polígonos não levam `stroke` nem `stroke-dasharray`: quem desenha o tracejado de repouso,
 * o branco do hover e o vermelho do selecionado é o CSS de `.carro-diagrama [data-vidro]`. O
 * `fill` claro e bem transparente é daqui, para a foto aparecer por baixo — no desenho vetorial
 * esse mesmo lugar recebe o gradiente de vidro.
 *
 * Os contornos foram traçados sobre a cabine ampliada, com uma grade nas coordenadas do próprio
 * `viewBox` projetada por cima, e conferidos a cada passe. São `path` com curva, não polígono:
 * numa vista 3/4 nenhuma dessas áreas é um quadrilátero — o teto é curvo, a coluna A é diagonal e
 * a linha de cintura desce para a frente. Quadrilátero reto fica visivelmente fora do vidro.
 *
 * São três, e não quatro: nesta foto o vidro traseiro não é área clicável clara — o que se vê ali
 * é a coluna C e a carroceria virando. E ele cairia no mesmo grupo do vidro da porta traseira, que
 * já está aqui, então não se perde nada.
 */
export function CarroFoto() {
  return (
    <div className="carro-foto">
      <Image
        src="/img/simulador/abarth-oficina.webp"
        alt="Carro visto de frente e de lado, dentro da oficina da The Dark Film"
        width={1600}
        height={993}
        sizes="(max-width: 768px) 100vw, 640px"
      />
      <svg
        className="carro-mascara"
        viewBox="0 0 400 248"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Para-brisa. O contorno segue o vidro em perspectiva: teto curvo em cima, a coluna A
            em diagonal à direita, o capô embaixo e a coluna A do lado de lá à esquerda. */}
        <path
          data-vidro="parabrisa"
          fill="rgba(255,255,255,.10)"
          d="M 158,51 C 170,45 188,38 208,34 C 230,30 252,27.8 271,27.3
             L 268,69 C 250,70 215,69.8 198,68.5 C 180,68 166,67 158,66 Z"
        />
        {/* Porta dianteira, entre as colunas A e B. A linha de cintura desce para a frente. */}
        <path
          data-vidro="dianteiro"
          fill="rgba(255,255,255,.10)"
          d="M 287.5,29.5 C 300,29.8 314,30.2 325,30.7 L 326,54
             C 312,56 299,57.5 288.5,58.7 Z"
        />
        {/* Porta traseira, entre as colunas B e C. */}
        <path
          data-vidro="traseiro"
          fill="rgba(255,255,255,.10)"
          d="M 331.5,33 C 342,33.5 353,34.5 361,35.5 L 361,53.5
             C 351,54.5 340,55.3 332,55.8 Z"
        />
      </svg>
    </div>
  );
}
