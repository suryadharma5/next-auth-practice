"use server"

import { LoginSchema, TLoginSchema } from "@/schemas"
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'
import { AuthError } from "next-auth"
import { getUserByEmail } from "@/data/user"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { prismaClient } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

export const login = async (values: TLoginSchema) => {
    const validatedFields = LoginSchema.safeParse(values)

    if(!validatedFields) {
        return { error: "Invalid fields"}
    }

    if(validatedFields.data) {
        const { email, password, code } = validatedFields.data

        const existingUser = await getUserByEmail(email)

        // check if not signedin using credentials
        if(!existingUser || !existingUser.email || !existingUser.password) {
            return { error: "Invalid credentials"}
        }

        if(!existingUser.emailVerified) {
            const verficationToken = await generateVerificationToken(existingUser.email)

            await sendVerificationEmail(
                verficationToken.email,
                verficationToken.token
            )

            return { success: "Confirmation email sent!"}
        }

        if(existingUser.isTwoFactorEnabled && existingUser.email) {
            if(code) {
                const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

                if(!twoFactorToken) {
                    return { error: "Invalid code!"}
                }

                if(twoFactorToken.token !== code) {
                    return { error: "Invalid code!" }
                }

                const hasExpired = new Date(twoFactorToken.expires) < new Date()

                if(hasExpired) {
                    return { error: "Code expired! "}
                }

                await prismaClient.twoFactorToken.delete({
                    where: {
                        id: twoFactorToken.id
                    }
                })

                const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

                if(existingConfirmation) {
                    await prismaClient.twoFactorConfirmation.delete({
                        where: {
                            id: existingConfirmation.id
                        }
                    })
                }

                await prismaClient.twoFactorConfirmation.create({
                    data: {
                        userId: existingUser.id
                    }
                })
            } else {
                const twoFactorToken = await generateTwoFactorToken(existingUser.email)
                await sendTwoFactorTokenEmail(
                    twoFactorToken.email,
                    twoFactorToken.token
                )
    
                return { twoFactor: true }
            }
        }

        try {
            await signIn('credentials', {
                email,
                password,
                redirectTo: DEFAULT_LOGIN_REDIRECT
            })
        } catch (error) {
            if (error instanceof AuthError) {
                switch(error.type) {
                    case "CredentialsSignin":
                        return { error: "Invalid credentials!"}
                    default:
                        return { error: "Something went wrong"}
                }
            }

            throw error
        }

        return { success: "Login success"}
    }

    // return { success: "Email sent!"}
}