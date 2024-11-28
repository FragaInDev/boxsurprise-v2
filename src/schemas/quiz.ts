import { z } from "zod";

export const QuizRespostasSchema = z.object({
  faixaEtaria: z.string().nonempty("Faixa etária é obrigatória."),
  genero: z.string().nonempty("Gênero é obrigatório."),
  hobbies: z.string().nonempty("Hobbies/Interesses são obrigatórios."),
  estilo: z.string().nonempty("Estilo predominante é obrigatório."),
  temas: z.string().nonempty("Temas preferidos são obrigatórios."),
  ocasiao: z.string().nonempty("Ocasião do presente é obrigatória."),
  tiposItens: z.string().nonempty("Tipos de itens preferidos são obrigatórios."),
  restricoes: z.string().optional(),
  coresFavoritas: z.string().nonempty("Cores favoritas são obrigatórias."),
  observacoes: z.string().optional(),
});

export type QuizRespostas = z.infer<typeof QuizRespostasSchema>;
