import { Box, Text, Heading, Flex } from '@chakra-ui/layout';
import { Project } from 'lib/types/common';
import React from 'react';

type ProjectEntryProps = {
    project: Project;
};

function ProjectEntry({ project }: ProjectEntryProps): JSX.Element {
    return (
        <Box
            border="solid 0.5px"
            borderRadius="0.5rem"
            margin="0.5rem 0.5rem"
            padding="0.5rem 1rem"
            backgroundColor="white"
            borderColor="gray.400"
            boxShadow="sm"
        >
            <Heading size="md" padding="0.5rem 0.5rem">
                {project.name}
            </Heading>
            <Text padding="0.5rem 0.5rem">{project.description}</Text>
        </Box>
    );
}

export default ProjectEntry;
