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

const Id: NextPage = () => {
    const { projects, isError, isLoading } = useProjects();
    const router = useRouter();
    const { id } = router.query;
    const project = projects ? projects.find((x) => `${x.id}` === id) : null;
    return (
        <Layout>
            <Flex flexDirection="column">
                {isLoading && <Loading></Loading>}
                {isError && <ErrorAlert title={isError.name} message={isError.name}></ErrorAlert>}
                {project ? <ProjectDetail project={project} /> : <Box>Not found</Box>}
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
