import React, { createContext, ReactNode } from "react"
import { FirebaseAuthState } from "@/lib/types/auth"

export const AuthContext = createContext<FirebaseAuthState>(
    {} as FirebaseAuthState
)

interface AuthProps {
    children: ReactNode
    auth: FirebaseAuthState
}

export const AuthProvider = ({ children, auth }: AuthProps): JSX.Element => (
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
)
