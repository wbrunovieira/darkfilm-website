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
 * `viewBox` projetada por cima — sempre sobre o MESMO arquivo que a página serve, e nunca sobre
 * um recorte intermediário. A primeira versão errou justamente aí: o recorte de conferência
 * cortava o vidro, então os contornos foram traçados até a borda do recorte e não até o vidro. São `path` com curva, não polígono:
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
          d="M 191.5,58.5 C 190.2,50 190.2,40 191,34.5 C 191.2,31 191.4,29.5 191.8,28.7
             C 205,26.4 226,24.5 247,23.3 C 255,22.9 262,22.8 265.8,22.9
             C 266.4,32 266.2,45 264.9,57 C 264.6,60.5 264.4,62.4 264.2,63.3
             C 250,65.8 226,66.5 209,64.8 C 200,63.9 194,61.5 191.5,58.5 Z"
        />
        {/* Porta dianteira, entre as colunas A e B. A linha de cintura desce para a frente. */}
        <path
          data-vidro="dianteiro"
          fill="rgba(255,255,255,.10)"
          d="M 289.1,58.1 C 287.6,50 287.6,38 289.1,30.4
             C 300,30.2 313,30 324,30 C 324.5,38 324.7,46 324.8,53.6
             C 313,55.2 301,56.7 289.1,58.1 Z"
        />
        {/* Porta traseira, entre as colunas B e C. */}
        <path
          data-vidro="traseiro"
          fill="rgba(255,255,255,.10)"
          d="M 331.1,52.9 C 330.9,46 330.9,38 331.1,31.9
             C 340,32.6 350,33.8 358.5,34.9 C 359,40 359.2,46 359.3,51
             C 350,51.7 340,52.4 331.1,52.9 Z"
        />
      </svg>
    </div>
  );
}
