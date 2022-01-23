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

type TimesheetFields = Partial<TimesheetDTO> & {
    project: ProjectDTO;
    status: 'ACTIVE';
};

const validateTimesheetFields = (fields: TimesheetFields): TimesheetDTO => {
    const { name, project, employee, status } = fields;
    if (name && project && employee && status) {
        return {
            ...fields,
            name,
            project,
            employee,
            status,
        };
    } else {
        throw 'Invalid timesheet form: Missing required fields';
    }
};

type TimesheetTableProps = {
    project: ProjectDTO;
    timesheets: TimesheetDTO[];
    refreshTimesheets: () => void;
    employees: EmployeeDTO[];
};

function TimesheetTable({
    project,
    refreshTimesheets,
    timesheets: previousTimesheets,
    employees,
}: TimesheetTableProps): JSX.Element {
    const [timesheetFields, setTimesheetFields] = useState<TimesheetFields>({ project, status: 'ACTIVE' });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>('');

    const submitTimesheet = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await postTimesheet(validateTimesheetFields(timesheetFields));
            await refreshTimesheets();
            onClose();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    const archiveTimesheet = async (timesheet: TimesheetDTO, e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await putTimesheet({ ...timesheet, status: 'ARCHIVED' });
            await refreshTimesheets();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    const setEmployee = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = parseInt(e.currentTarget.value);
        if (id && employees) {
            const employee = employees.find((employee) => employee.id === id);
            if (employee) {
                setTimesheetFields({ ...timesheetFields, employee: { ...employee }, project: { ...project } });
            } else {
                throw `Error timesheet form could not find employee with id ${id}.`;
            }
        }
    };

    const invalidAllocation =
        (timesheetFields.allocation && (timesheetFields.allocation < 0 || timesheetFields.allocation > 100)) || false;

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
                        <Select onChange={setEmployee} placeholder="Select employee">
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
                                setTimesheetFields({
                                    ...timesheetFields,
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
                                setTimesheetFields({
                                    ...timesheetFields,
                                    description: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                    <FormControl isInvalid={invalidAllocation}>
                        <FormLabel>Allocation</FormLabel>
                        <Input
                            placeholder="0"
                            onChange={(e) =>
                                setTimesheetFields({
                                    ...timesheetFields,
                                    allocation: parseInt(e.target.value),
                                })
                            }
                        />
                        <FormErrorMessage>Allocation needs to be between 1 and 100 %.</FormErrorMessage>
                    </FormControl>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={submitTimesheet}>
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
