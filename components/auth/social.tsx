"use client"

import { signIn } from "next-auth/react"

import { FcGoogle } from "react-icons/fc"
import { Button } from "../ui/button"
import { FaGithub } from "react-icons/fa"
import { DEFAULT_LOGIN_REDIRECT } from "@/route"

export const Social = () => {
    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT
        })
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick('google')}
            >
                <FcGoogle className="w-5 h-5"/>
            </Button>

            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick('github')}
            >
                <FaGithub className="w-5 h-5"/>
            </Button>
        </div>
    )
}