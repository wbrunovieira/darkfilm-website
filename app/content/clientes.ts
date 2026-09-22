/**
 * Os quatro clientes em destaque na home, com a imagem de fundo de cada um.
 *
 * Pedido do cliente em 21/09/2026, 22h45. O bloco era uma grade de nomes em texto; ele quer que
 * "deixe de ser apenas uma relação de nomes e passe a mostrar visualmente alguns clientes e
 * instituições atendidos". Saíram Tec Auto (Ford) e Carl Zeiss, entraram Auto Itália e
 * Tempermaster, e a Fundação passou a ser chamada pelo nome que ele escreveu.
 *
 * **Só a fachada da Auto Itália é foto real** — é a loja de Petrópolis, e ele próprio escreveu
 * "foto real da fachada". As outras três são ilustrações. Por isso nenhuma legenda aqui afirma
 * que a imagem mostra um trabalho executado pela The Dark Film: o que a imagem faz é evocar o
 * ramo do cliente. Dizer o contrário seria inventar serviço, que é justamente o que não se faz
 * neste projeto.
 *
 * **Pendência com o cliente:** a imagem da Fundação retrata a Casa de Santos Dumont, prédio
 * público real e um dos cartões-postais de Petrópolis, e a ilustração não corresponde fielmente
 * a ele. Turbina genérica ninguém contesta; a Encantada, qualquer petropolitano reconhece — e
 * reconhece que está errada. Confirmar com ele, ou trocar por foto real.
 *
 * **Placas:** a foto da Auto Itália tinha três placas legíveis nos carros da garagem, mascaradas
 * no mesmo mosaico usado no resto do site.
 */

export type Cliente = {
  nome: string;
  /** Segunda linha do nome, quando existe. Serve para o nome longo não desequilibrar o quadro. */
  complemento?: string;
  img: string;
  /**
   * `object-position` do fundo. Os quatro arquivos têm proporções diferentes (dois quadrados,
   * um 1100×948, um 1100×1100) e o quadro é largo: sem isto, o corte central cortaria justamente
   * o que identifica cada imagem — o letreiro da concessionária, o telhado da casa.
   */
  foco: string;
  /** Descrição do que a imagem mostra. Não afirma serviço prestado — ver o comentário do topo. */
  alt: string;
};

export const CLIENTES: Cliente[] = [
  {
    nome: "GE Celma",
    img: "/img/clientes/cliente--ge-celma-turbina.jpg",
    foco: "60% 50%",
    alt: "Motor aeronáutico aberto em hangar de manutenção",
  },
  {
    nome: "Auto Itália",
    complemento: "Concessionária Fiat",
    img: "/img/clientes/cliente--auto-italia-fachada.jpg",
    foco: "50% 38%",
    alt: "Fachada de vidro da concessionária Auto Itália, em Petrópolis",
  },
  {
    nome: "Tempermaster",
    img: "/img/clientes/cliente--tempermaster-esquadria.jpg",
    foco: "50% 50%",
    alt: "Porta de correr em esquadria de PVC e vidro, aberta para a mata",
  },
  {
    nome: "Fundação de Cultura",
    complemento: "e Turismo de Petrópolis",
    img: "/img/clientes/cliente--fundacao-casa-santos-dumont.jpg",
    foco: "50% 46%",
    alt: "Casa de Santos Dumont, em Petrópolis",
  },
];
