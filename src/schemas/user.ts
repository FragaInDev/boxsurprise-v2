import { z } from "zod";

// Esquema para a requisição de cadastro
export const RegisterRequestSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  telefone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido"),
  dataNascimento: z.string().nonempty("A data de nascimento é obrigatória"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Esquema para a resposta do cadastro
export const RegisterResponseSchema = z.object({
  mensagem: z.string(),
});

// Tipos inferidos do Zod
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
