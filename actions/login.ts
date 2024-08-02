"use server"

import { LoginSchema, TLoginSchema } from "@/schemas"
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'
import { AuthError } from "next-auth"

export const login = async (values: TLoginSchema) => {
    const validatedFields = LoginSchema.safeParse(values)

    if(!validatedFields) {
        return { error: "Invalid fields"}
    }

    if(validatedFields.data) {
        const { email, password } = validatedFields.data

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