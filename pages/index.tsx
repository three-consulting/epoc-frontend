import React from 'react';
import type { NextPage } from 'next';
import Layout from '@/components/Layout';
import { Box, Button } from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/client';

const Home: NextPage = () => {
    const [session, loading] = useSession();
    console.log(session);
    return (
        <Layout>
            <Box>Nothing to see here</Box>
        </Layout>
    );
};

export default Home;
