import { User as FirebaseUser } from "firebase/auth"

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}

type FirebaseAuthStateBase = {
    role?: Role
    loading: boolean
    firebaseError: unknown
    signOutAndClear: () => Promise<void>
    signInWithGoogle: () => Promise<void>
}

export type FirebaseAuthStateNullableUser = {
    user: FirebaseUser | null
} & FirebaseAuthStateBase

export type FirebaseAuthState = {
    user: FirebaseUser
    email: string
} & FirebaseAuthStateNullableUser
