import React, { createContext, ReactNode } from "react"
import { FirebaseAuthState, UserState } from "@/lib/types/auth"
import useFirebaseAuth from "@/lib/hooks/useFirebaseAuth"

export const AuthContext = createContext<FirebaseAuthState>(
    {} as FirebaseAuthState
)

export const UserContext = createContext<UserState>({} as UserState)

interface AuthProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProps): JSX.Element => {
    const auth = useFirebaseAuth()

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const UserProvider = ({ children }: AuthProps): JSX.Element | null => {
    const { user } = useFirebaseAuth()

    return (
        user && (
            <UserContext.Provider value={{ user }}>
                {children}
            </UserContext.Provider>
        )
    )
}
