import { useState, useEffect } from "react"
import { createFirebaseApp } from "@/firebase/clientApp"
import {
    User as FirebaseUser,
    onAuthStateChanged,
    getAuth,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth"
import { FirebaseAuthStateNullableUser, Role } from "@/lib/types/auth"

export default function useFirebaseAuth(): FirebaseAuthStateNullableUser {
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
        setLoading(false)
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        provider.addScope("profile")
        provider.addScope("email")
        await signInWithPopup(auth, provider)
    }

    useEffect(() => {
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
        return () => unsubscriber()
    }, [])

    return {
        user,
        role,
        loading,
        firebaseError,
        signOutAndClear,
        signInWithGoogle,
    }
}
