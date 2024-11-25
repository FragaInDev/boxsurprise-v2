import logo from "../assets/logo.svg"
import { Separator } from "./ui/separator"
import { ShoppingCart } from "lucide-react"
import { NavLink } from "./nav-link"
import { AccountMenu } from "./account-menu"

export function HeaderAdm(){
    return (
        <div className="border-b">
            <div className="flex h-16 items-center gap-6 px-6">
                <img className="w-48" src={logo} alt="logo box surprise" />
                <Separator orientation="vertical" className="h-6"/>

                <nav className="flex items-center space-x-4 lg:space-x-6">
                    <NavLink to="/pedidos">
                        <ShoppingCart className="h-4 w-4" />
                        Pedidos
                    </NavLink>
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <AccountMenu />
                </div>
            </div>
        </div>
    )
}