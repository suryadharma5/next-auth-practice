import { prismaClient } from "@/lib/db"

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await prismaClient.twoFactorToken.findUnique({
            where: {
                token: token
            }
        })

        return twoFactorToken
    } catch {
        return null
    }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await prismaClient.twoFactorToken.findFirst({
            where: {
                email: email
            }
        })

        return twoFactorToken
    } catch {
        return null
    }
}