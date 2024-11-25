import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import api from '@/services/api'
import { toast } from 'sonner'

import { Pedido } from '@/types'

interface PedidosFiltrosProps {
  onFilter?: (dadosFiltrados: Pedido[] | null) => void
}

export function PedidosFiltros({ onFilter }: PedidosFiltrosProps) {
  const [statusPedido, setStatusPedido] = useState<string>('TODOS')
  const [isFiltering, setIsFiltering] = useState<boolean>(false)

  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsFiltering(true)

    try {
      const response = await api.get('/adm/listar-pedidos-por-status', {
        params: { status: statusPedido },
      })

      if (response.data && response.data.dado) {
        const pedidosFiltrados: Pedido[] = response.data.dado
        onFilter?.(pedidosFiltrados)
        toast.success('Pedidos filtrados com sucesso!')
      } else {
        onFilter?.([])
        toast.info('Nenhum pedido encontrado para o status selecionado.')
      }
    } catch (error) {
      console.error('Erro ao filtrar os pedidos:', error)
      toast.error('Nenhum pedido encontrado para o status selecionado.')
    } finally {
      setIsFiltering(false)
    }
  }

  const handleClearFilters = async () => {
    setStatusPedido('TODOS')
    setIsFiltering(true)

    try {
      const response = await api.get('/adm/listar-pedidos-por-status', {
        params: { status: 'TODOS' },
      })

      if (response.data && response.data.dado) {
        const pedidos: Pedido[] = response.data.dado
        onFilter?.(pedidos)
        toast.success('Filtros removidos, exibindo todos os pedidos.')
      } else {
        onFilter?.([])
        toast.info('Nenhum pedido encontrado.')
      }
    } catch (error) {
      console.error('Erro ao carregar todos os pedidos:', error)
      toast.error('Erro ao carregar os pedidos.')
    } finally {
      setIsFiltering(false)
    }
  }

  return (
    <form className="flex items-center gap-2" onSubmit={handleFilter}>
      <span className="text-sm font-semibold">Filtrar por status:</span>
      <Select value={statusPedido} onValueChange={setStatusPedido}>
        <SelectTrigger className="h-8 w-[180px]">
          <SelectValue placeholder="Selecione um status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos os status</SelectItem>
          <SelectItem value="PENDENTE">Pendente</SelectItem>
          <SelectItem value="PROCESSANDO">Em processamento</SelectItem>
          <SelectItem value="ANALISANDO">Analisando</SelectItem>
          <SelectItem value="AGUARDANDO_PRODUTOS">Aguardando produtos</SelectItem>
          <SelectItem value="MONTANDO_CAIXA">Montando caixa</SelectItem>
          <SelectItem value="ENVIADO">Enviado</SelectItem>
          <SelectItem value="ENTREGUE">Entregue</SelectItem>
          <SelectItem value="CANCELADO">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" variant="secondary" disabled={isFiltering}>
        <Search className="h-4 w-4 mr-2" />
        {isFiltering ? 'Filtrando...' : 'Filtrar'}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleClearFilters}
        disabled={isFiltering}
      >
        <X className="h-4 w-4 mr-2" />
        {isFiltering ? 'Removendo...' : 'Remover filtros'}
      </Button>
    </form>
  )
}
