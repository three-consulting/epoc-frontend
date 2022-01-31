import React, { createContext, ReactNode } from "react"
import { AuthState } from "../types/auth"
import { useAuth } from "../hooks/useAuth"

export const AuthContext = createContext<AuthState>({} as AuthState)

interface AuthProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProps): JSX.Element => {
    const auth = useAuth()

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
