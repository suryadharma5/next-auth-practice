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

export type TLoginSchema = z.infer<typeof LoginSchema>
export type TRegisterSchema = z.infer<typeof RegisterSchema>