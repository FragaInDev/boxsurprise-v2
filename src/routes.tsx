import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/auth/login";
import { Cadastro } from "./pages/auth/cadastro";
import { AuthLayout } from "./pages/_layouts/auth";
import { Pedidos } from "./pages/app/adm/Pedidos/pedidos";
import { AdmLayout } from "./pages/_layouts/adm";
import { UserLayout } from "./pages/_layouts/user";
import { Home } from "./pages/app/cliente/home";
import { Analise } from "./pages/app/adm/analise";
import { Quiz } from "./pages/app/cliente/quiz";
import { Carrinho } from "./pages/app/cliente/carrinho";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {path: '/login', element: <Login/>},
            {path: '/cadastro', element: <Cadastro/>},
        ]
    },
    {
        path: '/',
        element: (
            <AdmLayout />
        ),
        children: [
          { path: '/pedidos', element: <Pedidos /> },
          { path: '/analise', element: <Analise /> },
        ],
    },
    {
        path: '/',
        element: (
            <UserLayout />
        ),
        children: [
          { path: '/home', element: <Home /> },
          { path: '/quiz', element: <Quiz /> },
          { path: '/carrinho', element: <Carrinho /> },
        ],
    },
    
])