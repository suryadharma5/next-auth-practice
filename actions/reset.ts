"use server"

import { getUserByEmail } from '@/data/user'
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/tokens'
import { ResetPasswordSchema, TResetPasswordSchema } from '@/schemas'
import React from 'react'

export const reset = async (values: TResetPasswordSchema) => {
    const validatedFields = ResetPasswordSchema.safeParse(values)

    if(!validatedFields.success) {
        return { error: "Invalid email!"}
    }

    const { email } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if(!existingUser) {
        return { error: "Invalid email"}
    }

    const generatedToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(generatedToken.email, generatedToken.token)

    return { success: "Reset email sent!"}
}
