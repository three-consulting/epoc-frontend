import { User as FirebaseUser } from "firebase/auth"

export interface FirebaseAuthState {
    user: FirebaseUser | null
    loading: boolean
    firebaseError: unknown
    signOutAndClear: () => Promise<void>
    signInWithGoogle: () => Promise<void>
}

export interface UserState {
    user: FirebaseUser
}
