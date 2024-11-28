import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

interface Pedido {
  idPedido: number;
  statusPedido: string;
  dataCriacao: string;
  dataAtualizacao: string;
  quantidadePedido: number;
  total: number;
  ruaEndereco: string;
  numeroEndereco: string;
  complementoEndereco?: string;
  cidadeEndereco: string;
  estadoEndereco: string;
  cepEndereco: string;
  itensPedido: Array<{
    idPedidoItem: number;
    produtoValor: number;
    produtoQuantidade: number;
    statusPedidoItem: string;
    produto: {
      idCaixa: number;
      valor: number;
      tamanhoCaixa: string;
    };
  }>;
}

export function Carrinho() {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPedidoAtual = async () => {
    try {
      setIsLoading(true);
      const idPedido = localStorage.getItem("idPedidoAtual");
      if (!idPedido) throw new Error("ID do pedido não encontrado.");

      const response = await api.get(`/usuario/buscar-pedido?idPedido=${idPedido}`);
      setPedido(response.data.dado);
    } catch (error) {
      toast.error("Erro ao carregar o pedido atual.");
    } finally {
      setIsLoading(false);
    }
  };

  const finalizarCompra = async () => {
    try {
      if (!pedido) return;
      await api.put(`/usuario/finalizar-compra?idPedido=${pedido.idPedido}`);
      toast.success("Compra finalizada com sucesso!");
      localStorage.removeItem("idPedidoAtual");
      navigate("/home");
    } catch (error) {
      toast.error("Erro ao finalizar a compra.");
    }
  };

  useEffect(() => {
    fetchPedidoAtual();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[900px]">
        <p>Carregando pedido...</p>
      </div>
    );
  }

  if (!pedido) {
    return <p className="text-center mt-10">Nenhum pedido atual encontrado.</p>;
  }

  const calcularSubtotal = () =>
    pedido.itensPedido.reduce(
      (acc, item) => acc + item.produtoValor * item.produtoQuantidade,
      0
    );

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {/* Coluna Esquerda - Itens do Pedido */}
      <div className="col-span-2 space-y-4 border rounded-md p-6">
        <h2 className="text-2xl font-bold">Itens do Pedido</h2>
        {pedido.itensPedido.map((item) => (
          <Card key={item.idPedidoItem} className="bg-muted p-4">
            <CardHeader>
              <h3 className="font-bold">Caixa #{item.produto.idCaixa}</h3>
              <p>
                <strong>Tamanho:</strong> {item.produto.tamanhoCaixa}
              </p>
              <p>
                <strong>Valor:</strong> R$ {item.produto.valor.toFixed(2)}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Coluna Direita - Resumo e Informações */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Endereço de Entrega</h2>
          </CardHeader>
          <CardContent>
            <p>
              {pedido.ruaEndereco}, {pedido.numeroEndereco},{" "}
              {pedido.complementoEndereco || "Sem complemento"}
            </p>
            <p>
              {pedido.cidadeEndereco}, {pedido.estadoEndereco} - CEP:{" "}
              {pedido.cepEndereco}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Resumo do Pedido</h2>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Subtotal:</strong> R$ {calcularSubtotal().toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> R$ {pedido.total.toFixed(2)}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={finalizarCompra} className="w-full">
              Finalizar Pedido
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
