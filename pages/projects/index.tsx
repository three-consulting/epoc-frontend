import React from 'react';
import type { NextPage } from 'next';
import { Box } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import useProjects from '@/lib/hooks/useProjects';

const Projects: NextPage = () => {
    const { projects, isLoading, isError } = useProjects();
    return (
        <Layout>
            <Box>A list of projects will appear here</Box>
        </Layout>
    );
};

export default Projects;
