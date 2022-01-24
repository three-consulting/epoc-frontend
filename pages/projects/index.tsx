import React from 'react';
import type { NextPage } from 'next';
import { Box, Heading } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import Layout from '@/components/common/Layout';
import ProjectTable from '@/components/table/ProjectTable';
import { useRouter } from 'next/dist/client/router';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import { useProjects } from '@/lib/hooks/useProjects';

const Projects: NextPage = () => {
    const router = useRouter();
    const { projectsResponse } = useProjects();

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                Projects
            </Heading>
            {projectsResponse.isLoading && <Loading />}
            {projectsResponse.isError && (
                <ErrorAlert title={projectsResponse.errorMessage} message={projectsResponse.errorMessage} />
            )}
            {projectsResponse.isSuccess && <ProjectTable projects={projectsResponse.data} />}
            <Box margin="1rem 0rem">
                <Button colorScheme="blue" onClick={() => router.push('/projects/new')}>
                    Add project
                </Button>
            </Box>
        </Layout>
    );
};

export default Projects;
