import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./schemas/index"
import { getUserByEmail } from "./data/user"
import bcryptjs from "bcryptjs"
 
export default {
    providers: [
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