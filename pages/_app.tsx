import type { AppProps } from "next/app"
import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { AuthProvider, UserProvider } from "@/lib/contexts/FirebaseAuthContext"
import "styles/Calendar.css"
import Layout from "@/components/common/Layout"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <AuthProvider>
            <ChakraProvider>
                <Layout>
                    <UserProvider>
                        <Component {...pageProps} />
                    </UserProvider>
                </Layout>
            </ChakraProvider>
        </AuthProvider>
    )
}
export default MyApp
