import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import React, { useState } from 'react';
import ErrorAlert from '../common/ErrorAlert';
import { putTimesheet } from '@/lib/utils/apiRequests';
import { EmployeeDTO, ProjectDTO, TimesheetDTO } from '@/lib/types/dto';
import { TimesheetForm } from '../form/TimesheetForm';

interface TimesheetTableProps {
    project: ProjectDTO;
    timesheets: TimesheetDTO[];
    refreshTimesheets: () => void;
    employees: EmployeeDTO[];
}

function TimesheetTable({
    project,
    refreshTimesheets,
    timesheets: previousTimesheets,
    employees,
}: TimesheetTableProps): JSX.Element {
    const [displayNewTimesheetForm, setDisplayNewTimesheetForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const archiveTimesheet = async (timesheet: TimesheetDTO, e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await putTimesheet({ ...timesheet, status: 'ARCHIVED' });
            await refreshTimesheets();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

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
            {previousTimesheets.length == 0 && (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    No users in this project.
                    <br />
                    To add a user click the button below.
                </Box>
            )}
            {previousTimesheets.length > 0 && (
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
                            {previousTimesheets.map((timesheet, idx) => {
                                if (timesheet.status === 'ACTIVE') {
                                    return (
                                        <Tr _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }} key={idx}>
                                            <Td>
                                                {timesheet.employee?.first_name} {timesheet.employee?.last_name}
                                            </Td>
                                            <Td>{timesheet.allocation} %</Td>
                                            <Td>
                                                <Button onClick={(e) => archiveTimesheet(timesheet, e)}>x</Button>
                                            </Td>
                                        </Tr>
                                    );
                                }
                            })}
                            {errorMessage ? (
                                <>
                                    <ErrorAlert />
                                    <Box>{errorMessage}</Box>
                                </>
                            ) : null}
                        </Tbody>
                    </Table>
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
                    <TimesheetForm
                        project={project}
                        employees={employees}
                        refreshTimesheets={refreshTimesheets}
                        onClose={() => setDisplayNewTimesheetForm(false)}
                    />
                    <ModalCloseButton />
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default TimesheetTable;
