import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import React, { useState } from 'react';
import ErrorAlert from '../common/ErrorAlert';
import { Employee, Project, Timesheet } from '@/lib/types/apiTypes';
import { CreateTimesheetForm } from '../form/TimesheetForm';
import { useUpdateTimesheets } from '@/lib/hooks/useTimesheets';

interface TimesheetRowProps {
    timesheet: Timesheet;
}
function TimesheetRow({ timesheet }: TimesheetRowProps): JSX.Element {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { putTimesheet } = useUpdateTimesheets();

    const archiveTimesheet = async (timesheet: Timesheet, e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await putTimesheet({ ...timesheet, status: 'ARCHIVED' });
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    return (
        <>
            {timesheet.status === 'ACTIVE' ? (
                <Tr _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}>
                    <Td>
                        {timesheet.employee?.first_name} {timesheet.employee?.last_name}
                    </Td>
                    <Td>{timesheet.allocation} %</Td>
                    <Td>
                        <Button onClick={(e) => archiveTimesheet(timesheet, e)}>x</Button>
                    </Td>
                </Tr>
            ) : null}
            {errorMessage ? (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            ) : null}
        </>
    );
}

interface TimesheetTableProps {
    project: Project;
    timesheets: Timesheet[];
    employees: Employee[];
}

function TimesheetTable({ project, timesheets, employees }: TimesheetTableProps): JSX.Element {
    const [displayNewTimesheetForm, setDisplayNewTimesheetForm] = useState(false);

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
            {timesheets ? (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Allocation</Th>
                                <Th />
                            </Tr>
                        </Thead>
                        <Tbody>
                            {timesheets.map((timesheet, idx) => (
                                <TimesheetRow timesheet={timesheet} key={idx} />
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            ) : (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    No users in this project.
                    <br />
                    To add a user click the button below.
                </Box>
            )}
            <Flex flexDirection="row-reverse">
                <Button colorScheme="blue" onClick={() => setDisplayNewTimesheetForm(true)}>
                    Add User
                </Button>
            </Flex>

            <Modal isOpen={displayNewTimesheetForm} onClose={() => setDisplayNewTimesheetForm(false)}>
                <ModalOverlay />
                <ModalContent px="0.5rem">
                    <ModalHeader>Add user to project</ModalHeader>
                    <CreateTimesheetForm
                        project={project}
                        employees={employees}
                        onClose={() => setDisplayNewTimesheetForm(false)}
                    />
                    <ModalCloseButton />
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default TimesheetTable;
