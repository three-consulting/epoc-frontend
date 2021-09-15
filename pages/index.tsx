import React from 'react';
import type { NextPage } from 'next';
import Layout from '@/components/common/Layout';
import { Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/client';

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
