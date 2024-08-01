"use server"

import { LoginSchema, TLoginSchema } from "@/schemas"

export const login = async (values: TLoginSchema) => {
    const validatedFiels = LoginSchema.safeParse(values)

    if(!validatedFiels) {
        return { error: "Invalid fields"}
    }

    return { success: "Email sent!"}
}