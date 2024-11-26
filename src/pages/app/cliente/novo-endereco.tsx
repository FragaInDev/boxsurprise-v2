import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/services/api";

interface NovoEnderecoProps {
  onSuccess: () => void; // Atualizado para chamar o carregamento completo
}

export function NovoEndereco({ onSuccess }: NovoEnderecoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cep: "",
    numero: "",
    complemento: "",
  });

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cep") {
      setFormData({ ...formData, cep: formatCEP(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        cep: formData.cep.replace("-", ""), // Remove a formatação do CEP
      };

      await api.post("/usuario/cadastrar-endereco", payload);

      toast.success("Endereço cadastrado com sucesso!");
      onSuccess(); // Chama o carregamento completo da lista de endereços
    } catch (error: any) {
      toast.error(
        error.response?.data?.mensagem || "Erro ao cadastrar endereço."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cep">CEP</Label>
        <Input
          id="cep"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          placeholder="00000-000"
          required
        />
      </div>
      <div>
        <Label htmlFor="numero">Número</Label>
        <Input
          id="numero"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          placeholder="Número"
          required
        />
      </div>
      <div>
        <Label htmlFor="complemento">Complemento</Label>
        <Input
          id="complemento"
          name="complemento"
          value={formData.complemento}
          onChange={handleChange}
          placeholder="Complemento (opcional)"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
}
