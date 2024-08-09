import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, UserRole } from "@prisma/client"
import authConfig from "./auth.config"
import { prismaClient } from "./lib/db"
import { getUserById } from "./data/user"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
 
export const {
  auth,
  handlers,
  signIn,
  signOut
} = NextAuth({
  callbacks: {
    // handle if user not verified, then user is not allow signin
    async signIn({ user, account }) {
      // console.log({account, user})
      //Allow oauth without email verification
      if (account?.provider !== 'credentials') {
        return true
      }

      const existingUser = await getUserById(user.id ?? "")

      // prevent sign in without email verification
      if(!existingUser?.emailVerified) {
        return false
      }

      if(existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        console.log({
          twoFactorConfirmation: twoFactorConfirmation
        })

        if(!twoFactorConfirmation) {
          return false
        }

        // Delete 2FA Confirmation
        await prismaClient.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          }
        })
      }

      return true
    },
    async session({ token, session }) {
      console.log({
        sessionToken: token,
        session: session
      })

      if(session.user && token.sub && token.role) {
        session.user.id = token.sub
        session.user.role = token.role as UserRole
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
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
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token
    }
  },
  events: {
    async linkAccount({ user }) {
      await prismaClient.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerified: new Date()
        }
      })
    }
  },
  // next-auth will always redirect to this page if something went wrong
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  adapter: PrismaAdapter(prismaClient),
  session: { strategy: "jwt" },
  ...authConfig,
})