"use server"

import { LoginSchema, TLoginSchema } from "@/schemas"
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'
import { AuthError } from "next-auth"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"

export const login = async (values: TLoginSchema) => {
    const validatedFields = LoginSchema.safeParse(values)

    if(!validatedFields) {
        return { error: "Invalid fields"}
    }

    if(validatedFields.data) {
        const { email, password } = validatedFields.data

        const existingUser = await getUserByEmail(email)

        // check if not signedin using credentials
        if(!existingUser || !existingUser.email || !existingUser.password) {
            return { error: "Invalid credentials"}
        }

        if(!existingUser.emailVerified) {
            const verficationToken = await generateVerificationToken(existingUser.email)

            return { success: "Confirmation email sent!"}
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