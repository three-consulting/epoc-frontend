import { Flex } from '@chakra-ui/layout';
import { Project } from 'lib/types/common';
import React from 'react';

type ProjectProps = {
    project: Project;
};

function ProjectDetail({ project }: ProjectProps): JSX.Element {
    return (
        <Flex flexDirection="column">
            <div>Project id: {project.id}</div>
            <div>Project name: {project.name}</div>
            <div>Project description: {project.description}</div>
            <div>Client id: {project.client_id}</div>
            <div>Created: {project.created}</div>
            <div>Start date: {project.start_date}</div>
            <div>Updated: {project.updated}</div>
            <div>Managing employee id: {project.managing_employee_id}</div>
            <div>End date: {project.end_date}</div>
        </Flex>
    );
}

export default ProjectDetail;
