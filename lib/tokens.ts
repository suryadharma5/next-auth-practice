import crypto from "crypto"
import { v4 as uuidv4 } from "uuid"

import { getVerificationTokenByEmail } from "@/data/verification-token"
import { prismaClient } from "./db"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // expires in 1 hour

    const existingToken = await getVerificationTokenByEmail(email)

    if(existingToken) {
        await prismaClient.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const verificationToken = await prismaClient.verificationToken.create({
        data: {
            token,
            expires,
            email
        }
    })

    return verificationToken
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // expires in 1 hour

    const existingToken = await getVerificationTokenByEmail(email)

    if(existingToken) {
        await prismaClient.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const passwordResetToken = await prismaClient.passwordResetToken.create({
        data: {
            token,
            expires,
            email
        }
    })

    return passwordResetToken
}

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100000, 1000000).toString()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getTwoFactorTokenByEmail(email)

    if(existingToken) {
        await prismaClient.twoFactorToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const twoFactorToken = await prismaClient.twoFactorToken.create({
        data: {
            email: email,
            token: token,
            expires: expires,
        }
    })

    return twoFactorToken
}