import { useEffect, useContext, useState } from "react"
import Auth, { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth"
import { AuthState, CognitoUserExt } from "../types/auth"
import { AuthContext } from "../contexts/AuthContext"
import { ICredentials } from "@aws-amplify/core"

export function useAuth(): AuthState {
    const [user, setUser] = useState<CognitoUserExt | undefined>()

    useEffect(() => {
        let active = true

        const check = async () => {
            const currentUser = await Auth.currentAuthenticatedUser()
            if (active) {
                setUser(currentUser)
            }
        }

        check()

        return () => {
            active = false
        }
    }, [setUser])

    const signIn = () =>
        Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Google,
        })
    const signOut = () => Auth.signOut()

    return { user, signIn, signOut }
}

export function useUser(): CognitoUserExt | undefined {
    const { user } = useContext(AuthContext)
    return user
}

export function useSignIn(): (() => Promise<ICredentials>) | undefined {
    return useContext(AuthContext).signIn
}

export function useSignout(): (() => Promise<void>) | undefined {
    return useContext(AuthContext).signOut
}
