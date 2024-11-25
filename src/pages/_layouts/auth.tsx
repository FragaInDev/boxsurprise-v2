import { Outlet } from "react-router-dom"
import logo from "../../assets/logo.svg"

export function AuthLayout() {
    return(
        <div className="min-h-screen grid grid-cols-2 antialiased">
            <div className="h-full border-r border-foreground/5 bg-auto bg-no-repeat bg-center bg-signin p-10 flex flex-col justify-between">
                <img className="w-48" src={logo} alt="logo box surprise" />
                <footer className="text-sm text-slate-50">
                    Todos os direitos reservados &copy; Box Surprise - {new Date().getFullYear()}
                </footer>
            </div>
            <div className="flex flex-col items-center justify-center relative">
                <Outlet />
            </div>
        </div>
    )
}