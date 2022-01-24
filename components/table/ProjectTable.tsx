import React from 'react';
import { Box, Heading } from '@chakra-ui/layout';
import { Table, TableCaption, Thead, Tr, Td, Th, Tbody } from '@chakra-ui/react';
import Link from 'next/link';
import { Project } from '@/lib/types/apiTypes';

interface ProjectRowProps {
    project: Project;
}

function ProjectRow({ project }: ProjectRowProps) {
    return (
        <Link href={`projects/${project.id}`}>
            <Tr _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}>
                <Td>{project.name}</Td>
                <Td>{project.customer?.name}</Td>
            </Tr>
        </Link>
    );
}

interface ProjectTableProps {
    projects: Project[];
}

function ProjectTable({ projects }: ProjectTableProps): JSX.Element {
    return projects ? (
        <Box backgroundColor="white" border="solid 0.5px" borderColor="gray.400" borderRadius="0.2rem">
            <Table variant="simple">
                <TableCaption>All projects</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Client</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {projects.map((project, idx) => (
                        <ProjectRow project={project} key={idx} />
                    ))}
                </Tbody>
            </Table>
        </Box>
    ) : (
        <Box>
            <Heading>No projects found</Heading>
        </Box>
    );
}

export default ProjectTable;
