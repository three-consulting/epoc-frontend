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
import React, { useMemo, useState } from 'react';
import ErrorAlert from '../common/ErrorAlert';
import useData from '@/lib/hooks/useData';
import Loading from '../common/Loading';
import { FormStatus } from '../form/ProjectForm';
import { listEmployees, postTimesheet, putTimesheet } from '@/lib/const';
import { TimesheetDTO } from '@/lib/types/dto';

type TimesheetTableProps = {
    timesheets: TimesheetDTO[];
};

const emptyTimesheet: TimesheetDTO = {
    name: '',
    description: '',
    allocation: 0,
};

function TimesheetTable({ timesheets: previousTimesheets }: TimesheetTableProps): JSX.Element {
    const employeesRequest = useMemo(() => listEmployees(), []);
    const employeesResponse = useData(employeesRequest);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [timesheet, setTimesheet] = useState<TimesheetDTO>(emptyTimesheet);
    const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.LOADING);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        setFormStatus(FormStatus.LOADING);
        try {
            await postTimesheet(timesheet);
            setFormStatus(FormStatus.SUCCESS);
            onClose();
        } catch (error) {
            setFormStatus(FormStatus.ERROR);
        }
    };

    const archiveTimesheet = async (timesheet: TimesheetDTO, e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await putTimesheet({ ...timesheet, status: 'ARCHIVED' });
            setFormStatus(FormStatus.SUCCESS);
        } catch (error) {
            setFormStatus(FormStatus.ERROR);
            setErrorMessage(`${error}`);
        }
    };

    const handleEmployeeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = parseInt(e.currentTarget.value);
        if (id && employeesResponse.isSuccess) {
            const employee = employeesResponse.data.find((employee) => employee.id === id);
            setTimesheet({ ...timesheet, employee: { id: employee?.id } });
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
            {employeesResponse.isLoading && <Loading />}
            {employeesResponse.isError && (
                <ErrorAlert title="Error loading data" message="Could not load the required data from the server" />
            )}
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
                            {formStatus == 'ERROR' ? (
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
                            {employeesResponse.isSuccess &&
                                employeesResponse.data.map((employee, idx) => {
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
                    {formStatus == 'ERROR' ? (
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
