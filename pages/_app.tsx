import type { AppProps } from "next/app"
import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { AuthProvider } from "@/lib/contexts/FirebaseAuthContext"
import "styles/Calendar.css"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <AuthProvider>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </AuthProvider>
    )
}
export default MyApp
