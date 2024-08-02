"use server"

import { prismaClient } from "@/lib/db";
import { RegisterSchema, TRegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens";

export async function register(values: TRegisterSchema) {
    const validatedFields = RegisterSchema.safeParse(values)

    if(!validatedFields.success) {
        return { error: "Invalid field data"}
    }

    const { email, name, password } = validatedFields.data

    const isUserExisted = await getUserByEmail(email)

    if(isUserExisted) {
        return { error: "Email already used!"}
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prismaClient.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    })

    const verificationToken = await generateVerificationToken(email)
    
    // TODO: Send verification token email

    return { success: "Confirmation email sent!"}
}