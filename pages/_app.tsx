import type { AppProps } from "next/app"
import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import "styles/Calendar.css"
import Layout from "@/components/common/Layout"
import { MediaProvider } from "@/lib/contexts/MediaContext"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <MediaProvider>
            <ChakraProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ChakraProvider>
        </MediaProvider>
    )
}
export default MyApp
