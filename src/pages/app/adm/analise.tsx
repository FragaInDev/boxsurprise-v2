import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import api from '@/services/api'
import { toast } from 'sonner'

export function Analise() {
  const [analise, setAnalise] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [respostas, setRespostas] = useState<string>('')
  const [idCaixa, setIdCaixa] = useState<number | null>(null)
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const idPedidoParam = searchParams.get('idPedido')
    const idPedidoItemParam = searchParams.get('idPedidoItem')

    if (idPedidoParam && idPedidoItemParam) {
      const numericIdPedido = parseInt(idPedidoParam, 10)
      const numericIdPedidoItem = parseInt(idPedidoItemParam, 10)

      if (!isNaN(numericIdPedido) && !isNaN(numericIdPedidoItem)) {
        fetchPedidoData(numericIdPedido, numericIdPedidoItem)
      } else {
        toast.error('IDs do pedido ou item inválidos.')
      }
    } else {
      toast.error('IDs do pedido ou item não encontrados.')
    }
  }, [location.search])

  const fetchPedidoData = async (idPedido: number, idPedidoItem: number) => {
    try {
      const response = await api.get('http://localhost:8080/usuario/buscar-pedido', {
        params: { idPedido },
      })

      if (response.data && response.data.dado) {
        const pedido = response.data.dado
        const item = pedido.itensPedido.find(
          (item: any) => item.idPedidoItem === idPedidoItem
        )

        if (item) {
          setIdCaixa(item.produto.idCaixa)
          setRespostas(item.produto.respostasBox || 'Sem respostas disponíveis.')
        } else {
          toast.error('Item correspondente não encontrado no pedido.')
        }
      } else {
        toast.error('Pedido não encontrado.')
      }
    } catch (error) {
      console.error('Erro ao buscar dados do pedido:', error)
      toast.error('Erro ao carregar dados do pedido.')
    }
  }

  const handleGerarAnalise = async () => {
    if (!idCaixa) {
      toast.error('Caixa não encontrada.')
      return
    }

    setIsGenerating(true)
    try {
      const response = await api.post(
        `http://localhost:8080/adm/gerar-analise`,
        null,
        { params: { idCaixa } }
      )

      if (
        response.data &&
        response.data.choices &&
        response.data.choices[0]?.message?.content
      ) {
        setAnalise(response.data.choices[0].message.content)
        toast.success('Análise gerada com sucesso!')
      } else {
        toast.error('Erro ao gerar a análise. Resposta inesperada do servidor.')
      }
    } catch (error) {
      console.error('Erro ao gerar análise:', error)
      toast.error('Erro ao gerar análise.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Helmet title="Análise do Pedido" />
      <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
        Gerar análise da caixa personalidade
        <Sparkles className="w-8 h-8" />
      </h1>

      <div className="grid grid-cols-2 mt-8 gap-4">
        {/* Respostas do Quiz */}
        <div className="flex flex-col gap-4 w-full h-fit p-6 rounded-md border border-muted">
          <h2 className="text-lg tracking-tight font-semibold">
            Respostas do quiz
          </h2>
          <div className="p-6 rounded-md border border-primary">
            <span>{respostas}</span>
          </div>
          <Button
            className="mt-auto"
            onClick={handleGerarAnalise}
            disabled={isGenerating}
          >
            {isGenerating ? 'Gerando...' : 'Gerar análise'}
            <Sparkles />
          </Button>
        </div>

        {/* Análise Gerada */}
        <div className="flex flex-col gap-2 p-6 rounded-md border border-muted">
          <h2 className="text-lg tracking-tight font-semibold mb-2">
            Análise da IA
          </h2>
          <div className="p-6 rounded-md border border-primary">
            {analise ? (
              <ReactMarkdown>{analise}</ReactMarkdown>
            ) : (
              <span>
                Nenhuma análise disponível. Por favor, gere uma análise.
              </span>
            )}
          </div>
          <Button variant="outline" className="ml-auto" asChild>
            <Link to="/pedidos">
              Gerenciar pedidos
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}
