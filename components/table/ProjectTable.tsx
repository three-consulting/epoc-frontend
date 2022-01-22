import React from 'react';
import { Box, Heading } from '@chakra-ui/layout';
import { Table, TableCaption, Thead, Tr, Td, Th, Tbody } from '@chakra-ui/react';
import Link from 'next/link';
import { ProjectDTO } from '@/lib/types/dto';

type ProjectListProps = {
    projects: ProjectDTO[];
};

function ProjectTable({ projects }: ProjectListProps): JSX.Element {
    if (projects && projects?.length > 0) {
        return (
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
                        {projects.map((project, idx) => {
                            return (
                                <Link href={`projects/${project.id}`} key={idx}>
                                    <Tr _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }} key={idx}>
                                        <Td>{project.name}</Td>
                                        <Td>{project.customer?.name}</Td>
                                    </Tr>
                                </Link>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>
        );
    } else {
        return (
            <Box>
                <Heading>No projects found</Heading>
            </Box>
        );
    }
}

export default ProjectTable;
