export interface Produto {
    idCaixa: number
    valor: number
    tamanhoCaixa: string
    respostasBox: string
  }
  
  export interface PedidoItem {
    idPedidoItem: number
    produtoValor: number
    produtoQuantidade: number
    statusPedidoItem: string
    produto: Produto
  }
  
  export interface Pedido {
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
  