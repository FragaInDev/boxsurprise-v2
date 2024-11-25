import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { decodeToken, logout } from "@/services/authService"; // Serviço de autenticação
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export function AccountMenu() {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Decodifica o token e obtém o nome do usuário
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = decodeToken(token);
        setUserName(decoded.nome);
      } catch (error) {
        toast.error("Erro ao decodificar o token.");
      }
    }
  }, []);

  // Função de logout
  const handleLogout = () => {
    logout(); // Remove token e informações do usuário
    toast.success("Você saiu da sua conta."); 
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">Olá, {userName || "Usuário"}</span>
      <Button variant="outline" className="text-rose-500" onClick={handleLogout}>
        <LogOut className="mr-2 w-4 h-4" />
        Sair
      </Button>
    </div>
  );
}
