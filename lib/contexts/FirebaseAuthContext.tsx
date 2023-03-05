import React, { createContext, ReactNode } from "react"
import { FirebaseAuthState } from "@/lib/types/auth"
import useFirebaseAuth from "@/lib/hooks/useFirebaseAuth"

const defaultFirebaseContext: FirebaseAuthState = {
    user: null,
    loading: false,
}

export const FirebaseContext = createContext<FirebaseAuthState>(
    defaultFirebaseContext
)

interface IFirebaseProvider {
    children: ReactNode
}

const FirebaseProvider = ({
    children,
}: IFirebaseProvider): JSX.Element | null => {
    const auth = useFirebaseAuth()

    return (
        auth.user && (
            <FirebaseContext.Provider value={auth}>
                {children}
            </FirebaseContext.Provider>
        )
    )
}

export default FirebaseProvider
