"use server"

import { signOut } from "@/auth"

export const logout = async () => {
    // do some server action before logout

    signOut()
}