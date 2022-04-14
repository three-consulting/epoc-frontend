import React, { createContext, ReactNode } from "react"
import { FirebaseAuthState } from "@/lib/types/auth"
import useFirebaseAuth from "@/lib/hooks/useFirebaseAuth"

export const AuthContext = createContext<FirebaseAuthState>(
    {} as FirebaseAuthState
)

interface AuthProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProps): JSX.Element => {
    const auth = useFirebaseAuth()

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
