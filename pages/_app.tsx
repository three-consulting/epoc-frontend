import type { AppProps } from "next/app"
import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import FirebaseProvider from "@/lib/contexts/FirebaseAuthContext"
import "styles/Calendar.css"
import Layout from "@/components/common/Layout"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <ChakraProvider>
            <FirebaseProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </FirebaseProvider>
        </ChakraProvider>
    )
}
export default MyApp
