import { Box, Text, Heading } from '@chakra-ui/layout';
import { Project } from 'lib/types/common';
import React from 'react';

type ProjectEntryProps = {
    project: Project;
};

function ProjectEntry({ project }: ProjectEntryProps): JSX.Element {
    return (
        <Box>
            <Heading>{project.name}</Heading>
            <Text>{project.description}</Text>
        </Box>
    );
}

export default ProjectEntry;
