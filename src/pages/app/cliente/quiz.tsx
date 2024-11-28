import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { enviarPedido } from "@/services/caixaService";
import { PedidoSchema } from "@/schemas/pedido";
import { QuizRespostas, QuizRespostasSchema } from "@/schemas/quiz";
import { valoresCaixa } from "@/constants/caixaValores";
import { QuizForm } from "./quiz-components/quiz-form";
import { SelectCaixa } from "./quiz-components/tamanho-caixa";
import { EscolhaEndereco } from "./quiz-components/escolha-endereco";

export function Quiz() {
  const [respostas, setRespostas] = useState<QuizRespostas>({
    faixaEtaria: "",
    genero: "",
    hobbies: "",
    estilo: "",
    temas: "",
    ocasiao: "",
    tiposItens: "",
    restricoes: "",
    coresFavoritas: "",
    observacoes: "",
  });
  const [tamanhoCaixa, setTamanhoCaixa] = useState<string | null>(null);
  const [idEndereco, setIdEndereco] = useState<number | null>(null);
  const [quizCompleto, setQuizCompleto] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (redirectTo: "quiz" | "carrinho") => {
    try {
      const respostasValidadas = QuizRespostasSchema.parse(respostas);

      const respostasBox = Object.entries(respostasValidadas)
        .map(([pergunta, resposta]) => `${pergunta}: ${resposta}`)
        .join("; ") +
        "; Baseado nesses dados, sugira itens que componham uma caixa de presente criativa e personalizada. Inclua detalhes sobre por que cada item foi escolhido e como ele se alinha às preferências do presenteado.";

      const payload = PedidoSchema.parse({
        valor: valoresCaixa[tamanhoCaixa as keyof typeof valoresCaixa],
        tamanhoCaixa,
        respostasBox,
        quantidade: 1,
        idEndereco,
      });

      const idPedido = await enviarPedido(payload);

      // Armazena o ID do pedido no localStorage
      localStorage.setItem("idPedidoAtual", idPedido.toString());

      if (redirectTo === "quiz") {
        setQuizCompleto(false);
        setTamanhoCaixa(null);
        setIdEndereco(null);
        setIsDialogOpen(false);
      } else {
        navigate(`/carrinho?idPedido=${idPedido}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Erro ao finalizar pedido.");
      } else {
        toast.error("Erro desconhecido.");
      }
    }
  };

  if (!quizCompleto) {
    return (
      <QuizForm
        setQuizRespostas={setRespostas}
        onQuizComplete={() => setQuizCompleto(true)}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[900px]">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold tracking-tight">Finalize sua compra</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <SelectCaixa tamanhoCaixa={tamanhoCaixa} setTamanhoCaixa={setTamanhoCaixa} />
          <EscolhaEndereco idEndereco={idEndereco} setIdEndereco={setIdEndereco} />
        </CardContent>
        <CardFooter>
          <Button
            className="flex gap-4 items-center ml-auto"
            onClick={() => setIsDialogOpen(true)}
            disabled={!tamanhoCaixa || !idEndereco}
          >
            Finalizar Pedido
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog para opções */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>O que deseja fazer agora?</DialogTitle>
            <DialogDescription>
              Você pode adicionar outra caixa ao pedido ou finalizar a compra.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button
              onClick={() => handleSubmit("quiz")}
              variant="outline"
            >
              Adicionar Mais Itens
            </Button>
            <Button
              onClick={() => handleSubmit("carrinho")}
              className="bg-green-600"
            >
              Ir para o Carrinho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
