import { Box, Flex } from '@chakra-ui/layout';
import React from 'react';
import { components } from '@/lib/types/api';

type ProjectProps = {
    project: components['schemas']['ProjectDTO'];
};

function ProjectDetail({ project }: ProjectProps): JSX.Element {
    return (
        <Flex flexDirection="column">
            <Box>Project id: {project.id}</Box>
            <Box>Project name: {project.name}</Box>
        </Flex>
    );
}

export default ProjectDetail;
