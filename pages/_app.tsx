import type { AppProps } from 'next/app';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Amplify from 'aws-amplify';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { setAmplify } from '@/lib/utils/setAmplify';

const updatedAwsConfig = setAmplify();

Amplify.configure(updatedAwsConfig);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <AuthProvider>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </AuthProvider>
    );
}
export default MyApp;
