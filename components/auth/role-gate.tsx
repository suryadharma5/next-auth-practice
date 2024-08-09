import { useCurrentRole } from "@/hooks/useCurrentRole"
import { UserRole } from "@prisma/client"
import { FormError } from "../form-error"

type RoleGateProps = {
    children: React.ReactNode
    allowedRole: UserRole
}

export function RoleGate({
    children,
    allowedRole
}: RoleGateProps) {
    const role = useCurrentRole()

    if(role !== allowedRole) {
        return (
            <FormError
                message="You don't have permission"
            />
        )
    }

    return (
        <>
            {children}
        </>
    )
}
