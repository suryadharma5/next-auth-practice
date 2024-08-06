import { z } from "zod"


export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required")
})

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Minumum 6 characters required"),
    name: z.string().min(1, "Name is required")
})

export const ResetPasswordSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    })
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    })
})

export type TLoginSchema = z.infer<typeof LoginSchema>
export type TRegisterSchema = z.infer<typeof RegisterSchema>
export type TResetPasswordSchema = z.infer<typeof ResetPasswordSchema>
export type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>