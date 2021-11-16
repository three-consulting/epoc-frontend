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
            <Box>Created: {project.created}</Box>
            <Box>Customer: {project.customer?.id}</Box>
            <Box>Customer Name: {project.customer?.name}</Box>
            <Box>Description: {project.description}</Box>
            <Box>End date: {project.endDate}</Box>
            <Box>Managing employee: {project.managingEmployee?.id}</Box>
            <Box>Managing employee Name: {project.managingEmployee?.first_name}</Box>
            <Box>Start date: {project.startDate}</Box>
            <Box>Project status: {project.status}</Box>
            <Box>Updated: {project.updated}</Box>
        </Flex>
    );
}

export default ProjectDetail;
