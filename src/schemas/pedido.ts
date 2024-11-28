import { z } from "zod";

export const PedidoSchema = z.object({
  valor: z.number().positive("O valor deve ser maior que zero."),
  tamanhoCaixa: z.enum(["PEQUENA", "MEDIA", "GRANDE"]),
  respostasBox: z.string().nonempty("As respostas do quiz são obrigatórias."),
  quantidade: z.number().int().positive().default(1),
  idEndereco: z.number().positive("O ID do endereço é obrigatório."),
});

export type Pedido = z.infer<typeof PedidoSchema>;
