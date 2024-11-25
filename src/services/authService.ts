import api from "./api";
import { LoginRequestSchema, LoginResponseSchema, LoginRequest } from "@/schemas/auth";
import { toast } from "sonner";
import {jwtDecode} from "jwt-decode";
import { clearUserEmail, setUserEmail } from "./userService";

// Tipo para representar o token decodificado
export interface DecodedToken {
  sub: string; // Email do usuário
  id: number;  // ID do usuário
  nome: string; // Nome do usuário
  tipoUsuario: string; // Tipo do usuário
  exp: number;  // Timestamp de expiração
}

// Função para decodificar o token JWT
export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};

// Função de login
export const login = async (credentials: LoginRequest): Promise<DecodedToken> => {
  try {
    // Valida as credenciais usando Zod
    LoginRequestSchema.parse(credentials);

    // Faz a requisição ao backend
    const response = await api.post("/usuario/login", credentials);

    // Valida e extrai o token da resposta
    const data = LoginResponseSchema.parse(response.data);
    const token = data.dado;

    // Salva o token no localStorage
    localStorage.setItem("jwtToken", token);

    // Salva o email do usuário no localStorage
    setUserEmail(credentials.email);

    // Decodifica o token JWT para obter informações do usuário
    const decoded = decodeToken(token);

    // Exibe mensagem de sucesso
    toast.success(data.mensagem);

    // Retorna o token decodificado
    return decoded;
  } catch (error: any) {
    // Trata erros de autenticação
    const errorMessage =
      error.response?.data?.mensagem || "Erro ao realizar login. Tente novamente.";

    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Função de logout
export const logout = (): void => {
  // Remove o token e o email armazenados
  localStorage.removeItem("jwtToken");
  clearUserEmail();

  // Exibe mensagem de sucesso
  toast.success("Você saiu da sua conta.");
};
