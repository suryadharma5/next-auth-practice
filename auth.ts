import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, UserRole } from "@prisma/client"
import authConfig from "./auth.config"
import { prismaClient } from "./lib/db"
import { getUserById } from "./data/user"
 
export const {
  auth,
  handlers,
  signIn,
  signOut
} = NextAuth({
  callbacks: {
    // async signIn({ user }) {
    //   console.log({signIn: user})

    //   const existingUser = await getUserById(user.id ?? "")

    //   if(!existingUser || !existingUser.emailVerified) {
    //     return false
    //   }

    //   return true
    // },

    async session({ token, session }) {
      console.log({
        sessionToken: token,
        session: session
      })

      if(session.user && token.sub && token.role) {
        session.user.id = token.sub
        session.user.role = token.role as UserRole
      }
      return session
    },
    async jwt({ token }) {
      console.log({token})

      if(!token.sub) {
        return token
      }

      const existingUser = await getUserById(token.sub)

      if(!existingUser) return token

      token.role = existingUser.role

      return token
    }
  },
  adapter: PrismaAdapter(prismaClient),
  session: { strategy: "jwt" },
  ...authConfig,
})