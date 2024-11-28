import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuizRespostas } from "@/schemas/quiz";

interface QuizFormProps {
  setQuizRespostas: React.Dispatch<React.SetStateAction<QuizRespostas>>;
  onQuizComplete: () => void;
}

export function QuizForm({ setQuizRespostas, onQuizComplete }: QuizFormProps) {
  const perguntas = [
    {
      pergunta: "Faixa etária",
      explicacao: "Qual a idade da pessoa que receberá a caixa?",
      tipo: "radio",
      opcoes: ["até 12 anos", "13 a 18 anos", "19 a 29 anos", "30 a 59 anos", "60 anos ou mais"],
      key: "faixaEtaria",
    },
    {
      pergunta: "Gênero",
      explicacao: "Escolha o gênero da pessoa que receberá o presente.",
      tipo: "radio",
      opcoes: ["Masculino", "Feminino", "Outro", "Prefiro não dizer"],
      key: "genero",
    },
    {
      pergunta: "Hobbies/Interesses",
      explicacao: "Liste os hobbies ou interesses mais marcantes da pessoa.",
      tipo: "texto",
      key: "hobbies",
    },
    {
      pergunta: "Estilo predominante",
      explicacao: "Qual o estilo predominante da pessoa?",
      tipo: "radio",
      opcoes: ["Casual", "Elegante", "Divertido", "Moderno", "Minimalista"],
      key: "estilo",
    },
    {
      pergunta: "Temas preferidos",
      explicacao: "Quais temas a pessoa mais gosta? (ex.: super-heróis, natureza)",
      tipo: "texto",
      key: "temas",
    },
    {
      pergunta: "Ocasião do presente",
      explicacao: "Qual a ocasião para o presente?",
      tipo: "radio",
      opcoes: ["Aniversário", "Data comemorativa", "Evento especial", "Sem motivo específico"],
      key: "ocasiao",
    },
    {
      pergunta: "Tipos de itens preferidos",
      explicacao: "Quais tipos de itens a pessoa prefere? (ex.: livros, roupas)",
      tipo: "texto",
      key: "tiposItens",
    },
    {
      pergunta: "Restrições ou coisas que não gosta",
      explicacao: "Algo que a pessoa não gosta ou possui restrição?",
      tipo: "texto",
      key: "restricoes",
    },
    {
      pergunta: "Cores favoritas",
      explicacao: "Quais cores a pessoa mais gosta?",
      tipo: "texto",
      key: "coresFavoritas",
    },
    {
      pergunta: "Observações adicionais",
      explicacao: "Alguma informação extra que gostaria de adicionar?",
      tipo: "texto",
      key: "observacoes",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
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

  const progresso = ((currentIndex + 1) / perguntas.length) * 100;

  const handleAnswer = (resposta: string) => {
    const key = perguntas[currentIndex].key as keyof QuizRespostas;
  
    setRespostas((prev) => {
      const updated = { ...prev, [key]: resposta };
      console.log("Respostas atualizadas:", updated); // Verificar as respostas armazenadas internamente
      return updated;
    });
  
    setQuizRespostas((prev) => {
      const updated = { ...prev, [key]: resposta };
      console.log("QuizRespostas atualizado (estado externo):", updated); // Verificar o estado externo
      return updated;
    });
  };
  

  const handleNext = () => {
    const key = perguntas[currentIndex].key as keyof QuizRespostas;
  
    if (!respostas[key]) {
      alert("Por favor, responda a pergunta antes de continuar.");
      return;
    }
  
    console.log("Respostas antes de avançar:", respostas); // Verificar o estado completo
  
    if (currentIndex < perguntas.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("Quiz completo. Enviando respostas:", respostas); // Verificar as respostas ao finalizar
      onQuizComplete();
    }
  };
  

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const perguntaAtual = perguntas[currentIndex];
  const respostaAtual = respostas[perguntaAtual.key as keyof QuizRespostas] || "";

  return (
    <div className="flex flex-col items-center justify-between pt-48 min-h-[900px]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">{perguntaAtual.pergunta}</CardTitle>
          {perguntaAtual.explicacao && (
            <p className="text-sm text-muted-foreground">{perguntaAtual.explicacao}</p>
          )}
        </CardHeader>
        <CardContent>
          {perguntaAtual.tipo === "radio" ? (
            <RadioGroup
              value={respostaAtual}
              onValueChange={handleAnswer}
              className="space-y-2"
            >
              {perguntaAtual.opcoes?.map((opcao, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={opcao} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{opcao}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Textarea
              value={respostaAtual}
              placeholder={`Responda sobre ${perguntaAtual.pergunta}`}
              onChange={(e) => handleAnswer(e.target.value)}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleBack} disabled={currentIndex === 0}>
            Voltar
          </Button>
          <Button onClick={handleNext}>
            {currentIndex < perguntas.length - 1 ? "Próxima Pergunta" : "Finalizar Quiz"}
          </Button>
        </CardFooter>
      </Card>
      <Progress value={progresso} className="mb-4" />
    </div>
  );
}
