import type { AppProps } from "next/app"
import React from "react"
import { MediaProvider } from "@/lib/contexts/MediaContext"
import { ChakraProvider } from "@chakra-ui/react"
import Layout from "@/components/common/Layout"
import Login from "@/components/common/Login"
import "styles/Calendar.css"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <MediaProvider>
            <ChakraProvider>
                <Login>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </Login>
            </ChakraProvider>
        </MediaProvider>
    )
}

export default MyApp
