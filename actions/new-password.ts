"use server"

import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user"
import { prismaClient } from "@/lib/db"
import { NewPasswordSchema, TNewPasswordSchema } from "@/schemas"
import bcrypt from "bcryptjs"

export const newPassword = async (values: TNewPasswordSchema, token: string | null) => {
    if(!token) {
        return { error: "Missing token!"}
    }

    const validatedFields = NewPasswordSchema.safeParse(values)

    if(!validatedFields) {
        return { error: "Invalid fields!"}
    }

    const { password } = validatedFields.data!

    const existingToken = await getPasswordResetTokenByToken(token)

    if(!existingToken) {
        return { error: "Invalid token!"}
    }

    const isTokenHasExpired = new Date(existingToken.expires) < new Date()

    if(isTokenHasExpired) {
        return { error: "Invalid token!"}
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if(!existingUser) {
        return { error: "Email doesn't exists"}
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prismaClient.user.update({
        where: {
            id: existingUser.id
        }, 
        data: {
            password: hashedPassword
        }
    })

    await prismaClient.passwordResetToken.delete({
        where: {
            id: existingToken.id
        }
    })

    return { success: "Password changed successfully"}
}