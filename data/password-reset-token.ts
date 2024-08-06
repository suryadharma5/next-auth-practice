import { prismaClient } from "@/lib/db"

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await prismaClient.passwordResetToken.findUnique({
            where: {
                token: token
            }
        })

        return passwordResetToken

    } catch {
        return null
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await prismaClient.passwordResetToken.findFirst({
            where: {
                email: email
            }
        })

        return passwordResetToken

    } catch {
        return null
    }
}