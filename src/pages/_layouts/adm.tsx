import { HeaderAdm } from "@/components/header-adm";
import { Outlet } from "react-router-dom";

export function AdmLayout() {
    return(
        <div className="flex min-h-screen flex-col antialiased">
            <HeaderAdm />

            <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
                <Outlet />
            </div>
        </div>
    )
}