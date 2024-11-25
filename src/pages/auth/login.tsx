import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { login } from "@/services/authService";
import { LoginRequest, LoginRequestSchema } from "@/schemas/auth";
import { toast } from "sonner";

export function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para gerenciar o botão
  const navigate = useNavigate(); // Para redirecionamento após login

  // Configuração do formulário com validação Zod
  const { register, handleSubmit } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
  });

  // Handler para envio do formulário
  const handleSignIn: SubmitHandler<LoginRequest> = async (data) => {
    setIsSubmitting(true);
    try {
      const decoded = await login(data); // Recebe o token decodificado
  
      // Redireciona com base no tipoUsuario
      switch (decoded.tipoUsuario) {
        case "CLIENTE":
          navigate("/home");
          break;
        case "ADM":
          navigate("/pedidos");
          break;
        default:
          throw new Error(`Tipo de usuário desconhecido: ${decoded.tipoUsuario}`);
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error(err.message || "Erro ao realizar login.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Acesse sua conta</h1>
            <p className="text-sm text-muted-foreground">Faça login para continuar</p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" {...register("senha")} />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              {isSubmitting ? "Aguarde..." : "Acessar minha conta"}
            </Button>

            <div className="flex justify-between gap-2 items-center max-w-full">
              <Separator className="w-36" />
              <span className="text-center text-sm leading-relaxed text-muted-foreground uppercase">ou</span>
              <Separator className="w-36" />
            </div>

            <Button variant="outline" asChild className="w-full">
              <Link to="/cadastro" className="flex items-center gap-3">
                Criar conta gratuita
                <ArrowRight />
              </Link>
            </Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <a className="underline underline-offset-4" href="/termos">
                termos de serviço
              </a>{" "}
              e{" "}
              <a className="underline underline-offset-4" href="/politicas">
                políticas de privacidade
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
