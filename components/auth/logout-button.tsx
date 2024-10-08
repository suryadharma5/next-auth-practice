"use client"

import { logout } from "@/actions/logout"
import { signOut } from "next-auth/react"

type LogoutButtonProps = {
    children: React.ReactNode
}

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {

    const onClick = () => {
        signOut()
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}