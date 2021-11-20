import React from 'react';
import type { NextPage } from 'next';
import Layout from '@/components/common/Layout';
import { Box, Button } from '@chakra-ui/react';
import { useSignIn, useSignout, useUser } from '@/lib/hooks/useAuth';

const Home: NextPage = () => {
    const user = useUser();
    const signIn = useSignIn();
    const signOut = useSignout();
    console.log(user);
    return (
        <Layout>
            <Box>Nothing to see here</Box>
            <Button colorScheme="teal" onClick={signIn}>
                Login
            </Button>
            <Button colorScheme="orange" onClick={signOut}>
                Logout
            </Button>
        </Layout>
    );
};

export default Home;
