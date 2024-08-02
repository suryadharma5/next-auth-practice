import React from "react";
import { auth, signOut } from "../../../auth";

export default  async function SettingsPage () {
    const session = await auth();
    return(
        <>
            <div>{JSON.stringify(session)}</div>
            <form action={async () => {
                "use server"
                await signOut()
            }}>
                <button type="submit">
                    Sign Out
                </button>
            </form>
        </>
    );
};
