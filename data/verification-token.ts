import { prismaClient } from "@/lib/db";

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await prismaClient.verificationToken.findFirst({
            where: {
                email: email
            }
        })

        return verificationToken
    } catch (error) {
        return null
    }
}

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await prismaClient.verificationToken.findUnique({
            where: {
                token: token
            }
        })

        return verificationToken
    } catch (error) {
        return null
    }
}