import React, { useMemo } from 'react';
import type { NextPage } from 'next';
import { Box, Heading, Text, Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import Layout from '@/components/common/Layout';
import ProjectTable from '@/components/table/ProjectTable';
import { useRouter } from 'next/dist/client/router';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import useData from '@/lib/hooks/useData';
import { listProjects } from '@/lib/utils/apiRequests';

const Projects: NextPage = () => {
    const router = useRouter();
    const projectRequest = useMemo(() => listProjects(), []);
    const projectResponse = useData(projectRequest);

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                Projects
            </Heading>
            {projectResponse.isLoading && <Loading />}
            {projectResponse.isError && (
                <ErrorAlert title={projectResponse.errorMessage} message={projectResponse.errorMessage} />
            )}
            {projectResponse.isSuccess && projectResponse.data.length > 0 ? (
                <ProjectTable projects={projectResponse.data} />
            ) : (
                <Flex
                    backgroundColor="white"
                    border="solid 0.5px"
                    borderColor="gray.400"
                    borderRadius="0.2rem"
                    padding="0.5rem 1rem"
                    boxShadow="sm"
                    flexDirection="column"
                >
                    <Heading size="lg">No projects</Heading>
                    <Text marginBottom="0.2rem">Add a new project by clicking the button below</Text>
                </Flex>
            )}
            <Box margin="1rem 0rem">
                <Button colorScheme="blue" onClick={() => router.push('/projects/new')}>
                    Add project
                </Button>
            </Box>
        </Layout>
    );
};

export default Projects;
