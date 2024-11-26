import { Helmet } from "react-helmet-async";
import { CaixaPersonalizadaCard } from "./CaixaPersonalizadaCard";
import { MeusEnderecos } from "./meus-enderecos";
import { MeusPedidos } from "./meus-pedidos";


export function Home() {
  return (
    <>
        <Helmet title="Home" />
        <div className="max-h-screen">
            <div className="flex flex-col gap-8 mb-6">
                <h1 className="flex items-center text-3xl font-bold tracking-tight">
                    Seja bem-vindo(a), Usuário!
                </h1>
                <CaixaPersonalizadaCard />
            </div>

            <div className="grid grid-cols-2 mt-8 gap-4">
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl tracking-tight font-semibold">
                        Meus pedidos
                    </h2>
                    <MeusPedidos />
                </div>
                
                <div className="flex flex-col gap-4">
                    <MeusEnderecos />
                </div>
            </div>
        </div>
    </>
  );
}
