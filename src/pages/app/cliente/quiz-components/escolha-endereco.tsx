import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchEnderecos } from "@/services/userService"; // Serviço para buscar endereços
import { LoaderCircle } from "lucide-react";

interface EscolhaEnderecoProps {
  idEndereco: number | null;
  setIdEndereco: React.Dispatch<React.SetStateAction<number | null>>;
}

export function EscolhaEndereco({ idEndereco, setIdEndereco }: EscolhaEnderecoProps) {
  const [enderecos, setEnderecos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar os endereços
  const loadEnderecos = async () => {
    try {
      setIsLoading(true);
      const enderecosData = await fetchEnderecos(); // Busca os endereços do backend
      setEnderecos(enderecosData);
    } catch (error) {
      toast.error("Erro ao carregar os endereços.");
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar endereços ao montar o componente
  useEffect(() => {
    loadEnderecos();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoaderCircle className="animate-spin" />
        <p className="ml-2">Carregando endereços...</p>
      </div>
    );
  }

  return (
    <RadioGroup value={String(idEndereco)} onValueChange={(value) => setIdEndereco(Number(value))}>
      {enderecos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado.</p>
      ) : (
        enderecos.map((endereco) => (
          <div key={endereco.idEndereco} className="flex items-center space-x-2">
            <RadioGroupItem value={String(endereco.idEndereco)} id={`endereco-${endereco.idEndereco}`} />
            <Label htmlFor={`endereco-${endereco.idEndereco}`}>
              {endereco.rua}, {endereco.numero} - {endereco.cidade}, {endereco.estado}
            </Label>
          </div>
        ))
      )}
    </RadioGroup>
  );
}
