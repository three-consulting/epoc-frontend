import { useEffect, useContext, useState } from "react"
import Auth, { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth"
import { AuthState } from "../types/auth"
import { CognitoUserExt } from "../types/auth"
import { AuthContext } from "../contexts/AuthContext"
import { ICredentials } from "@aws-amplify/core"

export function useAuth(): AuthState {
    const [user, setUser] = useState<CognitoUserExt | undefined>(undefined)

    useEffect(() => {
        let active = true

        const check = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser()
                if (active) setUser(user)
            } catch (error) {
                if (active) setUser(undefined)
            }
        }

        check()

        return () => {
            active = false
        }
    }, [setUser])

    const signIn = () => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })
    const signOut = () => Auth.signOut()

    return { user, signIn, signOut }
}

export function useUser(): CognitoUserExt | undefined {
    const { user } = useContext(AuthContext)
    if (!user) return undefined
    return user
}

export function useSignIn(): (() => Promise<ICredentials>) | undefined {
    return useContext(AuthContext).signIn
}

export function useSignout(): (() => Promise<void>) | undefined {
    return useContext(AuthContext).signOut
}
