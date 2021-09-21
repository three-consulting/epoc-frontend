import React from 'react';
import { List, ListItem, Box, Heading } from '@chakra-ui/layout';
import { Table, TableCaption, Thead, Tr, Td, Th, Tbody } from '@chakra-ui/react';
import { Project } from '@/lib/types/common';

type ProjectListProps = {
    projects: Project[];
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
                                <Tr _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }} key={idx}>
                                    <Td>{el.name}</Td>
                                    <Td>{el.client_id}</Td>
                                </Tr>
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
