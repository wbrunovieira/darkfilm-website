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
 * um recorte intermediário, e com linhas-âncora coloridas em coordenadas conhecidas para calibrar
 * a leitura. Duas versões erraram antes disto: a primeira porque o recorte de conferência cortava
 * o próprio vidro, a segunda porque a régua do recorte foi deduzida em vez de conferida contra um
 * ponto conhecido da foto. Se for refazer: desenhe as âncoras primeiro. São `path` com curva, não polígono:
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
          d="M 182.1,67.1 C 183,60 185,56 187.5,52.5 C 191,46 196,40 204.5,34.4
             C 208,32 214,29.5 222.6,28.3 C 240,27.3 260,27 271.1,27.1
             C 274,27.2 276,27.6 277.7,28.3
             C 273.5,39.2 269.2,50.1 265,61 C 263.5,64.5 262,68 261.4,69.5
             C 240,70.8 220,69.8 210.5,68.9 C 198,68 188,67.5 182.1,67.1 Z"
        />
        {/* Porta dianteira, entre as colunas A e B. A linha de cintura desce para a frente. */}
        <path
          data-vidro="dianteiro"
          fill="rgba(255,255,255,.10)"
          d="M 287.4,58.6 C 287.5,48 287.8,38 288,29.5
             C 300,30.2 312,31 323.7,31.7 C 324.2,39 324.6,48 324.9,55.6
             C 312,56.7 299,57.8 287.4,58.6 Z"
        />
        {/* Porta traseira, entre as colunas B e C. */}
        <path
          data-vidro="traseiro"
          fill="rgba(255,255,255,.10)"
          d="M 331.6,53.7 C 331.8,46 332,38 332.2,31.9
             C 340,32.8 348,33.7 355.8,34.6 C 356.1,40 356.3,46 356.4,51.3
             C 348,52.2 339,53 331.6,53.7 Z"
        />
      </svg>
    </div>
  );
}
