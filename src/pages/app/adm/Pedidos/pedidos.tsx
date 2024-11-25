import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  import { Helmet } from 'react-helmet-async'
  import { Pagination } from '@/components/pagination'
  import api from '@/services/api'
  import { useEffect, useState } from 'react'
  import { toast } from 'sonner'
  import { Loader2 } from 'lucide-react'
  import { PedidosFiltros } from './pedidos-filtros'
  import { PedidoTableRow } from './pedidos-table-row'
  
  import { Pedido } from '@/types'

  export function Pedidos() {
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalCount, setTotalCount] = useState(0)
    const [pageIndex, setPageIndex] = useState<number>(0)
    const perPage = 10
  
    async function fetchPedidos(page = 0) {
      setIsLoading(true)
      try {
        const response = await api.get('/adm/listar-pedidos-por-status', {
          params: {
            status: 'TODOS',
            page,
            limit: perPage,
          },
        })
  
        const pedidosData = response.data.dado
        setPedidos(pedidosData)
        setTotalCount(pedidosData.length)
        toast.success('Pedidos carregados com sucesso!')
      } catch (error) {
        console.error('Erro ao buscar os pedidos:', error)
        toast.error('Erro ao carregar os pedidos.')
      } finally {
        setIsLoading(false)
      }
    }
  
    useEffect(() => {
      fetchPedidos(pageIndex)
    }, [pageIndex])
  
    const handlePageChange = (newPageIndex: number) => {
      setPageIndex(newPageIndex)
    }
  
    const handleFilter = (dadosFiltrados: Pedido[] | null) => {
      if (dadosFiltrados) {
        setPedidos(dadosFiltrados)
        setTotalCount(dadosFiltrados.length)
      } else {
        fetchPedidos(pageIndex)
      }
    }
  
    return (
      <>
        <Helmet title="Pedidos" />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <div className="space-y-2.5">
            <PedidosFiltros onFilter={handleFilter} />
  
            {isLoading ? (
              <div className="flex gap-3 items-center justify-center h-32">
                <Loader2 className="animate-spin" />
                Carregando
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead className="w-[64px]"> </TableHead>
                      <TableHead className="w-[140px]">ID</TableHead>
                      <TableHead className="w-[240px]">Data de compra</TableHead>
                      <TableHead className="w-[240px]">Status</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="w-[140px]">Total do Pedido</TableHead>
                      <TableHead className="w-[164px]"> </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidos.map((pedido) => (
                      <PedidoTableRow key={pedido.idPedido} pedido={pedido} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <Pagination
              pageIndex={pageIndex}
              totalCount={totalCount}
              perPage={perPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </>
    )
  }
  