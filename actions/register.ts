"use server"

import { RegisterSchema, TRegisterSchema } from "@/schemas";

export async function register(values: TRegisterSchema) {
    const validatedFiels = RegisterSchema.safeParse(values)

    if(!validatedFiels.success) {
        return { error: "Invalid field data"}
    }

    return { success: "Email sent!"}
}