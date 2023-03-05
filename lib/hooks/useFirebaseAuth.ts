import { useState, useEffect } from "react"
import { createFirebaseApp } from "@/firebase/clientApp"
import {
    User as FirebaseUser,
    onAuthStateChanged,
    getAuth,
    signOut,
    signInWithRedirect,
    GoogleAuthProvider,
} from "firebase/auth"
import { FirebaseAuthState, Role } from "@/lib/types/auth"

export default function useFirebaseAuth(): FirebaseAuthState {
    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [firebaseError, setFirebaseError] = useState<unknown | null>(null)
    const [role, setRole] = useState<Role | undefined>(undefined)

    const app = createFirebaseApp()
    const auth = getAuth(app)

    const clear = () => {
        setUser(null)
        setLoading(true)
    }

    const signOutAndClear = async () => {
        await signOut(auth)
        clear()
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        provider.addScope("profile")
        provider.addScope("email")
        await signInWithRedirect(auth, provider)
    }

    const unsubscriber = onAuthStateChanged(auth, (authUser) => {
        try {
            if (authUser) {
                setUser(authUser)
                authUser.getIdTokenResult(false).then((token) => {
                    setRole(token.claims.role as Role)
                })
            }
        } catch (error) {
            setFirebaseError(error)
        } finally {
            setLoading(false)
        }
    })

    useEffect(() => () => unsubscriber(), [])

    return {
        user,
        role,
        loading,
        firebaseError,
        signOutAndClear,
        signInWithGoogle,
    }
}
