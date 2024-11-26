import { useEffect, useState } from "react";
import { fetchPedidos } from "@/services/userService";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderCircle } from "lucide-react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Pedido } from "@/types"; 
import { Card } from "@/components/ui/card";


dayjs.extend(customParseFormat);

// Função para mapear cores dos status
const getStatusColor = (status: string): string => {
  switch (status) {
    case "PENDENTE":
      return "text-slate-400";
    case "PROCESSANDO":
      return "text-yellow-400";
    case "ANALISANDO":
      return "text-blue-400";
    case "AGUARDANDO_PRODUTOS":
      return "text-orange-400";
    case "MONTANDO_CAIXA":
      return "text-purple-400";
    case "ENVIADO":
      return "text-green-400";
    case "ENTREGUE":
      return "text-teal-400";
    default:
      return "text-gray-400";
  }
};

// Função para formatar a data
const formatDate = (dateString: string): string =>
  dayjs(dateString, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY");

export function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPedidos() {
      try {
        const pedidosData: Pedido[] = await fetchPedidos();
        setPedidos(pedidosData);
      } catch (error) {
        toast.error("Erro ao carregar os pedidos.");
      } finally {
        setIsLoading(false);
      }
    }
    loadPedidos();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2">
        <LoaderCircle className="animate-spin" />
        Carregando informações
      </div>
    );
  }

  return (
    <Card>
    <Table>
      <TableCaption>
        {pedidos.length > 0
          ? "Lista de pedidos realizados."
          : "Você ainda não realizou nenhum pedido."}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID Pedido</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead>Valor Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <TableRow key={pedido.idPedido}>
              <TableCell className="font-medium">{pedido.idPedido}</TableCell>
              <TableCell className={getStatusColor(pedido.statusPedido)}>
                {pedido.statusPedido}
              </TableCell>
              <TableCell>{formatDate(pedido.dataCriacao)}</TableCell>
              <TableCell>
                {pedido.total ? `R$ ${pedido.total.toFixed(2)}` : "N/A"}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Nenhum pedido encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    </Card>
  );
}
