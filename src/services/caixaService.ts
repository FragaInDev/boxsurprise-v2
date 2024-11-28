import api from "@/services/api";

/**
 * Adiciona uma caixa ao pedido no backend e retorna o ID do pedido.
 */
export const enviarPedido = async (dados: {
  valor: number;
  tamanhoCaixa: string;
  respostasBox: string;
  quantidade: number;
  idEndereco: number;
}): Promise<number> => {
  try {
    const response = await api.post("/usuario/comprarCaixa", dados);
    const idPedido = response.data.dado; // Retorna o ID do pedido criado
    if (!idPedido) {
      throw new Error("ID do pedido não retornado pelo backend.");
    }
    localStorage.setItem("idPedido", String(idPedido)); // Armazena o ID do pedido no localStorage
    return idPedido;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensagem || "Erro ao adicionar caixa ao pedido.");
  }
};

/**
 * Finaliza a compra para o pedido especificado.
 */
export const finalizarCompra = async (idPedido: number): Promise<void> => {
  try {
    await api.put(`/usuario/finalizar-compra?idPedido=${idPedido}`);
    localStorage.removeItem("idPedido"); // Remove o ID do pedido após a finalização
  } catch (error: any) {
    throw new Error(error.response?.data?.mensagem || "Erro ao finalizar a compra.");
  }
};

/**
 * Busca os detalhes de um pedido específico.
 */
export const buscarPedido = async (idPedido: number) => {
  try {
    const response = await api.get(`/usuario/buscar-pedido?idPedido=${idPedido}`);
    return response.data.dado; // Retorna os detalhes do pedido
  } catch (error: any) {
    throw new Error(error.response?.data?.mensagem || "Erro ao buscar o pedido.");
  }
};

/**
 * Lista todos os pedidos do usuário logado.
 */
export const listarPedidosUsuario = async () => {
  try {
    const response = await api.get("/usuario/listar-pedido-usuario-logado");
    return response.data.dado; // Retorna a lista de pedidos do usuário
  } catch (error: any) {
    throw new Error(error.response?.data?.mensagem || "Erro ao listar os pedidos do usuário.");
  }
};

/**
 * Retorna o ID do pedido pendente armazenado no localStorage.
 * Caso não esteja armazenado, dispara um erro.
 */
export const obterIdPedidoAtual = (): number => {
  const idPedido = localStorage.getItem("idPedido");
  if (!idPedido) {
    throw new Error("Nenhum pedido pendente encontrado.");
  }
  return Number(idPedido);
};
