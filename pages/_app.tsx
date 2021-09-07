import type { AppProps } from 'next/app';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'next-auth/client';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider options={{ clientMaxAge: 0, keepAlive: 0 }} session={pageProps.session}>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </Provider>
    );
}
export default MyApp;
