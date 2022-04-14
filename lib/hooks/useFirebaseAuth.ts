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
import { FirebaseAuthState } from "@/lib/types/auth"

export default function useFirebaseAuth(): FirebaseAuthState {
    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [firebaseError, setFirebaseError] = useState<unknown | null>(null)

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

    useEffect(() => {
        const unsubscriber = onAuthStateChanged(auth, (authUser) => {
            try {
                if (authUser) {
                    setUser(authUser)
                }
            } catch (error) {
                setFirebaseError(error)
            } finally {
                setLoading(false)
            }
        })
        return () => unsubscriber()
    }, [])

    return {
        user,
        loading,
        firebaseError,
        signOutAndClear,
        signInWithGoogle,
    }
}
