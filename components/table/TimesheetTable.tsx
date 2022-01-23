import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    useDisclosure,
} from '@chakra-ui/react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import React, { useState } from 'react';
import ErrorAlert from '../common/ErrorAlert';
import { postTimesheet, putTimesheet } from '@/lib/utils/apiRequests';
import { EmployeeDTO, ProjectDTO, TimesheetDTO } from '@/lib/types/dto';

type TimesheetTableProps = {
    project: ProjectDTO;
    timesheets: TimesheetDTO[];
    refreshTimesheets: () => void;
    employees: EmployeeDTO[];
};

const emptyTimesheet: TimesheetDTO = {
    name: '',
    description: '',
    allocation: 0,
};

function TimesheetTable({
    project,
    refreshTimesheets,
    timesheets: previousTimesheets,
    employees,
}: TimesheetTableProps): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [timesheet, setTimesheet] = useState<TimesheetDTO>(emptyTimesheet);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await postTimesheet(timesheet);
            await refreshTimesheets();
            onClose();
        } catch (error) {
            setErrorMessage(error.toString);
        }
    };

    const archiveTimesheet = async (timesheet: TimesheetDTO, e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await putTimesheet({ ...timesheet, status: 'ARCHIVED' });
            await refreshTimesheets();
        } catch (error) {
            setErrorMessage(error.toString);
        }
    };

    const handleEmployeeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = parseInt(e.currentTarget.value);
        if (id && employees) {
            const employee = employees.find((employee) => employee.id === id);
            setTimesheet({ ...timesheet, employee: { ...employee }, project: { ...project } });
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
                <Button colorScheme="blue" onClick={onOpen}>
                    Add User
                </Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent px="0.5rem">
                    <ModalHeader>Add user to project</ModalHeader>
                    <ModalCloseButton />
                    <FormControl>
                        <FormLabel>User</FormLabel>
                        <Select onChange={handleEmployeeChange} placeholder="Select employee">
                            {employees.map((employee, idx) => {
                                return (
                                    <option key={idx} value={employee.id}>
                                        {`${employee.first_name} ${employee.last_name}`}
                                    </option>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Timesheet Name</FormLabel>
                        <Input
                            placeholder="Timesheet Name"
                            onChange={(e) =>
                                setTimesheet({
                                    ...timesheet,
                                    name: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Input
                            placeholder="Description"
                            onChange={(e) =>
                                setTimesheet({
                                    ...timesheet,
                                    description: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                    <FormControl isInvalid={!((timesheet.allocation || 0) > 0 && (timesheet.allocation || 101) <= 100)}>
                        <FormLabel>Allocation</FormLabel>
                        <Input
                            placeholder="0"
                            onChange={(e) =>
                                setTimesheet({
                                    ...timesheet,
                                    allocation: parseInt(e.target.value),
                                })
                            }
                        />
                        <FormErrorMessage>Allocation needs to be between 1 and 100 %.</FormErrorMessage>
                    </FormControl>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button colorScheme="gray" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                    {errorMessage ? (
                        <>
                            <ErrorAlert />
                            <Box>{errorMessage}</Box>
                        </>
                    ) : null}
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default TimesheetTable;
