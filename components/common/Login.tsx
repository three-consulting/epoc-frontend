import React from "react"
import { Box, Button, Center, Stack } from "@chakra-ui/react"
import useFirebaseAuth from "@/lib/hooks/useFirebaseAuth"
import { AuthProvider } from "@/lib/contexts/FirebaseAuthContext"
import Loading from "./Loading"

type LoginPageProps = {
    signInWithGoogle: () => Promise<void>
}

const LoginPage = ({ signInWithGoogle }: LoginPageProps) => (
    <Center height="100vh">
        <Stack textAlign="center">
            <p>Welcome to Epoc.</p>
            <Box>
                <Button onClick={signInWithGoogle}>
                    <p>Log in</p>
                </Button>
            </Box>
        </Stack>
    </Center>
)

type LoginProps = {
    children: JSX.Element
}

const Login = ({ children }: LoginProps) => {
    const auth = useFirebaseAuth()
    const { user, signInWithGoogle } = auth

    if (auth.loading) {
        return <Loading />
    } else if (user && user.email) {
        return (
            <AuthProvider auth={{ ...auth, user, email: user.email }}>
                {children}
            </AuthProvider>
        )
    }
    return <LoginPage signInWithGoogle={signInWithGoogle} />
}

export default Login
