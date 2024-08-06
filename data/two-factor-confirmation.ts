import { prismaClient } from "@/lib/db"

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const twoFactorConfirmation = await prismaClient.twoFactorConfirmation.findUnique({
            where: {
                userId: userId
            }
        })

        return twoFactorConfirmation
    } catch {
        return null
    }
}