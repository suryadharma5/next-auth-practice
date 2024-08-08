import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Navbar } from "./_components/navbar";

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    return (
        <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <SessionProvider session={session}>
                <Navbar/>
                {children}
            </SessionProvider>
        </div>
    )
}

export default ProtectedLayout;
