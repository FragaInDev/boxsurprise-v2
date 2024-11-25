import { useEffect, useState } from 'react'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/services/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

// Tipagem para Produto
interface Produto {
  idCaixa: number
  valor: number
  tamanhoCaixa: string
  respostasBox: string
}

// Tipagem para Item do Pedido
interface PedidoItem {
  idPedidoItem: number
  produtoValor: number
  produtoQuantidade: number
  statusPedidoItem: string
  produto: Produto
}

// Tipagem para o Pedido
interface Pedido {
  idPedido: number
  statusPedido: string
  dataCriacao: string
  dataAtualizacao: string
  quantidadePedido: number
  emailCliente: string
  telefoneCliente: string
  cpfCliente: string
  ruaEndereco: string
  numeroEndereco: string
  complementoEndereco?: string
  cidadeEndereco: string
  estadoEndereco: string
  cepEndereco: string
  total: number
  itensPedido: PedidoItem[]
}

interface PedidoDetalhesProps {
  idPedido: number
}

function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatTelefone(telefone: string): string {
  return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export function PedidoDetalhes({ idPedido }: PedidoDetalhesProps) {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Busca detalhes do pedido
  useEffect(() => {
    async function fetchPedido() {
      setIsLoading(true)
      try {
        const response = await api.get(`http://localhost:8080/usuario/buscar-pedido`, {
          params: { idPedido },
        })
        if (response.data && response.data.dado) {
          setPedido(response.data.dado)
        } else {
          toast.error('Não foi possível carregar os detalhes do pedido.')
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do pedido:', error)
        toast.error('Erro ao carregar os detalhes do pedido.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPedido()
  }, [idPedido])

  // Atualiza o status do item
  const handleStatusChange = async (idPedidoItem: number, novoStatus: string) => {
    try {
      await api.put('http://localhost:8080/adm/mudar-status-item', {
        idPedidoItem,
        novoStatus,
      })

      if (pedido) {
        setPedido({
          ...pedido,
          itensPedido: pedido.itensPedido.map((item) =>
            item.idPedidoItem === idPedidoItem
              ? { ...item, statusPedidoItem: novoStatus }
              : item
          ),
        })
      }

      toast.success('Status do item atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar o status do item:', error)
      toast.error('Erro ao atualizar o status do item.')
    }
  }

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'text-gray-500 bg-gray-950'
      case 'PROCESSANDO':
        return 'text-yellow-500 bg-yellow-950'
      case 'ANALISANDO':
        return 'text-blue-500 bg-blue-950'
      case 'AGUARDANDO_PRODUTOS':
        return 'text-orange-500 bg-orange-950'
      case 'MONTANDO_CAIXA':
        return 'text-purple-500 bg-purple-950'
      case 'ENVIADO':
        return 'text-green-500 bg-green-950'
      case 'ENTREGUE':
        return 'text-teal-500 bg-teal-950'
      default:
        return 'text-gray-500 bg-gray-950'
    }
  }

  if (isLoading) {
    return (
      <DialogContent>
        <div className="flex justify-center items-center h-32">
          Carregando detalhes do pedido...
        </div>
      </DialogContent>
    )
  }

  if (!pedido) {
    return (
      <DialogContent>
        <div className="text-center">Erro ao carregar os detalhes.</div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="max-w-[1080px]">
      <DialogHeader>
        <DialogTitle>Pedido: {pedido.idPedido}</DialogTitle>
        <DialogDescription>Detalhes do pedido</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Cliente</TableCell>
              <TableCell className="text-right">{pedido.emailCliente}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Telefone</TableCell>
              <TableCell className="text-right">{formatTelefone(pedido.telefoneCliente)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">CPF</TableCell>
              <TableCell className="text-right">{formatCPF(pedido.cpfCliente)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedido.itensPedido.map((item) => (
              <TableRow key={item.idPedidoItem}>
                <TableCell>Caixa Personalizada</TableCell>
                <TableCell className="text-right">{item.produtoQuantidade}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-semibold py-1 px-3 rounded-full ${getStatusColorClass(
                      item.statusPedidoItem
                    )}`}
                  >
                    {item.statusPedidoItem.replace(/_/g, ' ')}
                  </span>
                </TableCell>
                <TableCell className="text-right">R$ {item.produtoValor.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  R$ {(item.produtoQuantidade * item.produtoValor).toFixed(2)}
                </TableCell>
                <TableCell className="flex items-center justify-end gap-2">
                  <Select
                    onValueChange={(novoStatus) =>
                      handleStatusChange(item.idPedidoItem, novoStatus)
                    }
                  >
                    <SelectTrigger className="h-8 w-[180px]">
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
                  <Button asChild size="xs">
                    <Link
                      to={`/analise?idPedido=${pedido.idPedido}&idPedidoItem=${item.idPedidoItem}`}
                      className="flex items-center gap-3"
                    >
                      Analisar
                      <Sparkles />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  )
}
