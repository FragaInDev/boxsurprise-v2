import { z } from "zod";

// Esquema para a requisição de login
export const LoginRequestSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Esquema para a resposta do login
export const LoginResponseSchema = z.object({
  mensagem: z.string(),
  dado: z.string(), // Token JWT retornado pelo backend
});

// Tipos inferidos do Zod
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
