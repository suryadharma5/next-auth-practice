import { v4 as uuidv4 } from "uuid"

import { getVerificationTokenByEmail } from "@/data/verification-token"
import { prismaClient } from "./db"

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