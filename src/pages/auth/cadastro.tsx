import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import {
  RegisterRequest,
  RegisterRequestSchema,
  RegisterResponseSchema,
} from "@/schemas/user"; // Atualizar para o arquivo certo
import { formatCPF, formatPhone, removeFormatting, formatDate } from "@/utils/formatters";

export function Cadastro() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue} = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
  });

  const handleRegister: SubmitHandler<RegisterRequest> = async (data) => {
    setIsSubmitting(true);
    try {
      // Valida o CPF e telefone formatados
      const formattedCPF = formatCPF(data.cpf);
      const formattedPhone = formatPhone(data.telefone);

      RegisterRequestSchema.parse({
        ...data,
        cpf: formattedCPF,
        telefone: formattedPhone,
      });

      // Envia os dados ao backend sem formatação
      const formattedData = {
        ...data,
        cpf: removeFormatting(formattedCPF),
        telefone: removeFormatting(formattedPhone),
      };

      const response = await fetch("http://localhost:8080/usuario/cadastrar-usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const responseData = await response.json();
      RegisterResponseSchema.parse(responseData);

      if (response.ok) {
        toast.success(
          <div>
            <span>{responseData.mensagem}</span>
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="ml-2 text-blue-500 underline"
            >
              Ir para login
            </Button>
          </div>
        );
      } else {
        throw new Error(responseData.mensagem || "Erro ao cadastrar usuário.");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao cadastrar usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet title="Cadastro" />
      <div className="p-8">
        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta</h1>
            <p className="text-sm text-muted-foreground">Preencha os campos abaixo para se cadastrar</p>
          </div>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" type="text" {...register("nome")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                {...register("cpf")}
                onChange={(e) => setValue("cpf", formatCPF(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="text"
                {...register("telefone")}
                onChange={(e) => setValue("telefone", formatPhone(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="text"
                {...register("dataNascimento")}
                onChange={(e) => setValue("dataNascimento", formatDate(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" {...register("senha")} />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              {isSubmitting ? "Aguarde..." : "Cadastrar"}
            </Button>

            <div className="flex justify-between gap-2 items-center max-w-full">
              <Separator className="w-36" />
              <span className="text-center text-sm leading-relaxed text-muted-foreground uppercase">ou</span>
              <Separator className="w-36" />
            </div>

            <Button variant="outline" asChild className="w-full">
              <Link to="/login" className="flex items-center gap-3">
                <ArrowLeft />
                Voltar para login
              </Link>
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

