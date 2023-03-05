import { User as FirebaseUser } from "firebase/auth"

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}

export interface FirebaseAuthState {
    user: FirebaseUser | null
    role?: Role
    loading: boolean
    firebaseError?: unknown
    signOutAndClear?: () => Promise<void>
    signInWithGoogle?: () => Promise<void>
}
