import React from 'react';
import type { NextPage } from 'next';
import Layout from '@/components/Layout';
import { Box, Button } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/client';

const Home: NextPage = () => {
    const [session, loading] = useSession();
    console.log(session, loading);
    console.log(`Cognito domain: ${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}`);
    console.log(`Cognito client id: ${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}`);
    console.log(`Cognito secret: ${process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET}`);
    return (
        <Layout>
            <Box>Please sign in by pressing the button below</Box>
            <Button
                colorScheme="purple"
                variant="solid"
                onClick={() => signIn('cognito', { callbackUrl: `${window.location.origin}` })}
            >
                Sign-in with Cognito
            </Button>
        </Layout>
    );
};

export default Home;
