import React from 'react';
import type { NextPage } from 'next';
import { Box, Heading, Text, Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import Layout from '@/components/common/Layout';
import useProjects from '@/lib/hooks/useProjects';
import ProjectTable from '@/components/projects/ProjectTable';

const Projects: NextPage = () => {
    const { projects, isLoading, isError } = useProjects();

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                Projects
            </Heading>
            {projects && projects?.length > 0 ? (
                <ProjectTable projects={projects}></ProjectTable>
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
                <Button colorScheme="blue">Add project</Button>
            </Box>
        </Layout>
    );
};

export default Projects;
