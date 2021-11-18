import React from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import type { NextPage } from 'next';
import useProjects from '@/lib/hooks/useProjects';
import { useRouter } from 'next/dist/client/router';
import ProjectDetail from '@/components/projects/ProjectDetail';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import Layout from '@/components/common/Layout';
import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import { components } from '@/lib/types/api';

const Id: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { projects, isError, isLoading } = useProjects<components['schemas']['ProjectDTO']>(id);
    return (
        <Layout>
            <Flex flexDirection="column">
                {isLoading && <Loading></Loading>}
                {isError && <ErrorAlert title={isError.name} message={isError.name}></ErrorAlert>}
                {projects ? <ProjectDetail project={projects} /> : <Box>Not found</Box>}
            </Flex>
            <Link key={`${id}`} href={`${id}/edit`}>
                <Button colorScheme="blue" marginTop="1rem">
                    Edit Project
                </Button>
            </Link>
        </Layout>
    );
};

export default Id;
