import { ProjectDTO } from '@/lib/types/dto';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import React from 'react';

type ProjectProps = {
    project: ProjectDTO;
};

function ProjectDetail({ project }: ProjectProps): JSX.Element {
    const { name, description, customer, startDate, endDate, status, managingEmployee } = project;
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
                <Box>{name}</Box>
            </Heading>
            <Flex>Description: {description}</Flex>
            <Flex>Customer: {customer?.name}</Flex>
            <Flex>Start date: {startDate}</Flex>
            <Flex>End date: {endDate}</Flex>
            <Flex>
                Managing employee: {managingEmployee?.first_name} {managingEmployee?.last_name}
            </Flex>
            <Flex>Project status: {status}</Flex>
        </Flex>
    );
}

export default ProjectDetail;