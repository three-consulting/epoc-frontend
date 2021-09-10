import React from 'react';
import type { NextPage } from 'next';
import Layout from '@/components/Layout';
import { Box, Button } from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/client';

const Home: NextPage = () => {
    const [session, loading] = useSession();
    console.log(session, loading);
    return (
        <Layout>
            <Box>Please sign in by pressing the button below</Box>
            <Button colorScheme="black" backgroundColor="white" variant="outline" onClick={() => signIn('cognito')}>
                Sign-in with Cognito
            </Button>
        </Layout>
    );
};

export default Home;
