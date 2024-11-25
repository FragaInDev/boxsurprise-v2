import { HeaderUser } from "@/components/header-user";
import { Outlet } from "react-router-dom";

export function UserLayout() {
    return(
        <div className="flex min-h-screen flex-col antialiased">
            <HeaderUser />

            <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
                <Outlet />
            </div>
        </div>
    )
}