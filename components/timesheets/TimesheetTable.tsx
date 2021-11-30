import { components } from '@/lib/types/api';
import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import React from 'react';

type TimesheetTableProps = {
    timesheets?: components['schemas']['TimesheetDTO'][];
};

function TimesheetTable({ timesheets }: TimesheetTableProps): JSX.Element {
    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
            marginTop="1.5rem"
        >
            <Heading as="h2" size="md">
                Users
            </Heading>
            {timesheets && timesheets?.length == 0 && (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    No users in this project.
                    <br />
                    To add a user click the button below.
                </Box>
            )}
            {timesheets && timesheets?.length !== 0 && (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Allocation</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {timesheets.map((el, idx) => {
                                return (
                                    <Tr _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }} key={idx}>
                                        <Td>{el.name}</Td>
                                        <Td>{el.allocation}</Td>
                                        <Td>
                                            <Button>x</Button>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>
            )}
            <Button colorScheme="blue" align="right" marginLeft="22rem">
                Add User
            </Button>
        </Flex>
    );
}

export default TimesheetTable;
