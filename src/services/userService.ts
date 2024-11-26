import api from "./api";

export interface User {
  name: string;
  email: string;
}

/**
 * Busca os detalhes do usuário logado pelo token armazenado.
 */
export const fetchUserDetails = async (): Promise<User> => {
  try {
    const response = await api.get("/adm/buscar-usuário-por-email", {
      params: { email: localStorage.getItem("userEmail") || "" },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Inclui o token JWT
      },
    });

    return response.data.dado; // Certifique-se de que o backend retorna os dados no formato esperado
  } catch (error: any) {
    console.error("Erro ao buscar os detalhes do usuário:", error);
    throw new Error(
      error.response?.data?.mensagem || "Não foi possível buscar os detalhes do usuário."
    );
  }
};

/**
 * Busca os pedidos do usuário logado.
 */
export const fetchPedidos = async () => {
  try {
    const response = await api.get("/usuario/listar-pedido-usuario-logado", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Inclui o token JWT
      },
    });

    return response.data.dado; // Retorna os pedidos
  } catch (error: any) {
    console.error("Erro ao buscar os pedidos do usuário:", error);
    throw new Error(
      error.response?.data?.mensagem || "Não foi possível buscar os pedidos do usuário."
    );
  }
};

/**
 * Busca os endereços do usuário logado.
 */
export const fetchEnderecos = async () => {
  try {
    const response = await api.get("/usuario/listar-endereco-usuario-logado", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Inclui o token JWT
      },
    });

    return response.data.dado; // Retorna os endereços
  } catch (error: any) {
    console.error("Erro ao buscar os endereços do usuário:", error);
    throw new Error(
      error.response?.data?.mensagem || "Não foi possível buscar os endereços do usuário."
    );
  }
};

/**
 * Armazena o email do usuário para ser usado em requisições futuras.
 */
export const setUserEmail = (email: string): void => {
  localStorage.setItem("userEmail", email);
};

/**
 * Remove o email do usuário armazenado.
 */
export const clearUserEmail = (): void => {
  localStorage.removeItem("userEmail");
};
