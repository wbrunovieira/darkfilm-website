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
 * Coordenadas calibradas sobre uma grade projetada na própria foto e conferidas no navegador.
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
      <svg className="carro-mascara" viewBox="0 0 400 248" preserveAspectRatio="none" aria-hidden>
        <polygon data-vidro="parabrisa" fill="rgba(255,255,255,.10)" points="162,66 180,30 284,26 273,70" />
        <polygon data-vidro="dianteiro" fill="rgba(255,255,255,.10)" points="290,30 330,27 332,57 290,61" />
        <polygon data-vidro="traseiro" fill="rgba(255,255,255,.10)" points="336,27 364,29 366,54 336,57" />
        <polygon data-vidro="vigia" fill="rgba(255,255,255,.10)" points="370,31 381,33 383,48 370,50" />
      </svg>
    </div>
  );
}
