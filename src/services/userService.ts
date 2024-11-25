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
