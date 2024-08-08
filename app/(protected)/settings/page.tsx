"use client"

import { logout } from "@/actions/logout";
import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { auth, signOut } from "../../../auth";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage () {
    // const session = await auth();
    // const session = useSession()
    const currentUser = useCurrentUser()

    const onClick = () => {
        logout()
    }
    return(
        <>
            {/* <div>{JSON.stringify(session)}</div> */}
            {/* <div>
                {JSON.stringify(currentUser)}
            </div> */}
            {/* <form action={async () => {
                "use server"
                await signOut()
            }}> */}
            {/* <button onClick={onClick} type="submit">
                Sign Out
            </button> */}
            {/* </form> */}

            <div className="bg-white p-10 rounded-xl">
                <LogoutButton>
                    Sign out
                </LogoutButton>
            </div>
        </>
    );
};
