import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./schemas/index"
import { getUserByEmail } from "./data/user"
import bcryptjs from "bcryptjs"
 
export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Credentials({
            async authorize (credentials) {
                const validatedFields = LoginSchema.safeParse(credentials)

                if(validatedFields.data) {
                    const { email, password } = validatedFields.data

                    const user = await getUserByEmail(email)

                    if(!user || !user.password) return null

                    const isPasswordValid = await bcryptjs.compare(password, user.password)

                    if(isPasswordValid) {
                        return user
                    }
                }

                return null
            }
        })
    ]
} satisfies NextAuthConfig