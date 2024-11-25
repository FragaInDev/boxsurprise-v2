import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog'
import { TableRow, TableCell } from '@/components/ui/table'
import { SquareArrowOutUpRight } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { PedidoDetalhes } from './pedidos-detalhes'
import api from '@/services/api'
import { toast } from 'sonner'

// Tipagem do Pedido
interface Pedido {
  idPedido: number
  statusPedido: string
  dataCriacao: string
  emailCliente: string
  total: number
}

interface PedidoTableRowProps {
  pedido: Pedido
}

export function PedidoTableRow({ pedido }: PedidoTableRowProps) {
  const [statusPedido, setStatusPedido] = useState(pedido.statusPedido)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Função para atualizar o status do pedido
  const handleStatusChange = async (novoStatus: string) => {
    try {
      await api.put('http://localhost:8080/adm/mudar-status-pedido', {
        idPedido: pedido.idPedido,
        novoStatus,
      })
      setStatusPedido(novoStatus)
      toast.success(`Status atualizado para: ${novoStatus}`)
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error)
      toast.error('Erro ao atualizar o status do pedido.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'text-slate-400'
      case 'PROCESSANDO':
        return 'text-yellow-400'
      case 'ANALISANDO':
        return 'text-blue-400'
      case 'AGUARDANDO_PRODUTOS':
        return 'text-orange-400'
      case 'MONTANDO_CAIXA':
        return 'text-purple-400'
      case 'ENVIADO':
        return 'text-green-400'
      case 'ENTREGUE':
        return 'text-teal-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => !open && setIsDialogOpen(false)}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
            >
              <SquareArrowOutUpRight className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            {isDialogOpen && <PedidoDetalhes idPedido={pedido.idPedido} />}
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-sm font-medium">
        {pedido.idPedido}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {pedido.dataCriacao}
      </TableCell>
      <TableCell className="">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${getStatusColor(statusPedido)}`}>
            {statusPedido.replace(/_/g, ' ')}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-medium">{pedido.emailCliente}</TableCell>
      <TableCell className="font-medium">
        R$ {pedido.total.toFixed(2)}
      </TableCell>
      <TableCell>
        <Select
          onValueChange={(novoStatus) => handleStatusChange(novoStatus)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Alterar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="PROCESSANDO">Em processamento</SelectItem>
            <SelectItem value="ANALISANDO">Analisando</SelectItem>
            <SelectItem value="AGUARDANDO_PRODUTOS">Aguardando produtos</SelectItem>
            <SelectItem value="MONTANDO_CAIXA">Montando caixa</SelectItem>
            <SelectItem value="ENVIADO">Enviado</SelectItem>
            <SelectItem value="ENTREGUE">Entregue</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  )
}
