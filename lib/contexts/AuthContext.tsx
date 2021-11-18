import { createContext } from 'react';

interface AuthState {
    user: string | null;
}

export const AuthContext = createContext<AuthState>({ user: null });
