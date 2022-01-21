import { ProjectDTO } from '@/lib/types/dto';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import React from 'react';

type ProjectProps = {
    project: ProjectDTO;
};

function ProjectDetail({ project }: ProjectProps): JSX.Element {
    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            <Heading>
                <Box>{project.name}</Box>
            </Heading>
            <Flex>Description: {project.description}</Flex>
            <Flex>Customer: {project.customer?.name}</Flex>
            <Flex>Start date: {project.startDate}</Flex>
            <Flex>End date: {project.endDate}</Flex>
            <Flex>
                Managing employee: {project.managingEmployee?.first_name} {project.managingEmployee?.last_name}
            </Flex>
            <Flex>Project status: {project.status}</Flex>
        </Flex>
    );
}

export default ProjectDetail;
