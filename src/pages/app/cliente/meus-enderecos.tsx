import { useEffect, useState } from "react";
import { fetchEnderecos } from "@/services/userService";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NovoEndereco } from "./novo-endereco";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MeusEnderecos() {
  const [enderecos, setEnderecos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar os endereços
  const loadEnderecos = async () => {
    try {
      setIsLoading(true);
      const enderecosData = await fetchEnderecos();
      setEnderecos(enderecosData);
    } catch (error) {
      toast.error("Erro ao carregar os endereços.");
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega os endereços na montagem do componente
  useEffect(() => {
    loadEnderecos();
  }, []);

  if (isLoading) {
    return <p>Carregando endereços...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl tracking-tight font-semibold">Meus endereços</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Adicionar novo endereço</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar novo endereço</DialogTitle>
            </DialogHeader>
            <NovoEndereco onSuccess={loadEnderecos} />
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-96 rounded-md border">
        <div className="p-6 flex flex-col gap-4">
          {enderecos.length === 0 ? (
            <p>Nenhum endereço cadastrado.</p>
          ) : (
            enderecos.map((endereco) => (
              <Card key={endereco.idEndereco} className="w-full bg-zinc-900">
                <CardHeader>
                  <CardTitle className="text-lg">Endereço #{endereco.idEndereco}</CardTitle>
                  <CardDescription>
                    {endereco.rua}, {endereco.numero} - {endereco.cidade}, {endereco.estado}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">CEP: {endereco.cep}</p>
                  {endereco.complemento && (
                    <p className="text-sm text-muted-foreground">
                      Complemento: {endereco.complemento}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
