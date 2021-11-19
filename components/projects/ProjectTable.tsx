import React from 'react';
import { Box, Heading } from '@chakra-ui/layout';
import { Table, TableCaption, Thead, Tr, Td, Th, Tbody } from '@chakra-ui/react';
import { components } from '@/lib/types/api';
import Link from 'next/link';

type ProjectListProps = {
    projects: components['schemas']['ProjectDTO'][];
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
                        {projects.map((el, idx) => {
                            return (
                                <Link href={`projects/${el.id}`} key={idx}>
                                    <Tr _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }} key={idx}>
                                        <Td>{el.name}</Td>
                                        <Td>{el.customer?.name}</Td>
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
