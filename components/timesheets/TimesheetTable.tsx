import { components } from '@/lib/types/api';
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
import { useSWRConfig } from 'swr';
import { FormStatus } from '../projects/NewProject/reducer';
import * as fetch from '@/lib/utils/fetch';
import ErrorAlert from '../common/ErrorAlert';
import useData from '@/lib/hooks/useData';
import Loading from '../common/Loading';

type TimesheetTableProps = {
    timesheets?: components['schemas']['TimesheetDTO'][];
    project?: components['schemas']['ProjectDTO'];
};

type StateType = {
    user: components['schemas']['EmployeeDTO'];
    timesheetName: string;
    description: string;
    allocation: number;
    formStatus: FormStatus;
    errorMessage: string;
};

function TimesheetTable({ timesheets, project }: TimesheetTableProps): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState<StateType>({
        user: { id: 0 },
        timesheetName: '',
        description: '',
        allocation: 0,
        formStatus: FormStatus.IDLE,
        errorMessage: '',
    });
    const {
        data: employees,
        isError: employeeError,
        isLoading: employeesLoading,
    } = useData<components['schemas']['EmployeeDTO'][]>('employee');

    const url = `${process.env.NEXT_PUBLIC_API_URL}/timesheet`;
    const { mutate } = useSWRConfig();

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        const createTimesheetRequest: components['schemas']['TimesheetDTO'] = {
            name: state.timesheetName,
            description: state.description,
            allocation: state.allocation,
            project: project,
            employee: state.user,
        };
        setState({
            ...state,
            formStatus: FormStatus.LOADING,
        });
        try {
            await fetch.post(url, createTimesheetRequest);
            mutate(`${url}?projectId=${project?.id}`);
            setState({
                ...state,
                formStatus: FormStatus.SUCCESS,
            });
            onClose();
        } catch (error) {
            setState({
                ...state,
                errorMessage: `${error}`,
                formStatus: FormStatus.ERROR,
            });
        }
    };

    const archiveTimesheet = async (timesheet: components['schemas']['TimesheetDTO'], e: React.MouseEvent) => {
        e.preventDefault();
        const createTimesheetRequest: components['schemas']['TimesheetDTO'] = {
            ...timesheet,
            status: 'ARCHIVED',
        };
        try {
            await fetch.put(url, createTimesheetRequest);
            mutate(`${url}?projectId=${project?.id}`);
            setState({
                ...state,
                errorMessage: '',
                formStatus: FormStatus.IDLE,
            });
        } catch (error) {
            setState({
                ...state,
                errorMessage: `${error}`,
                formStatus: FormStatus.ERROR,
            });
        }
    };

    const handleEmployeeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = e.currentTarget.value;
        if (id) {
            const employee = employees?.find((el) => el.id === Number(id));
            setState({
                ...state,
                user: { ...employee },
            });
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
            {employeesLoading && <Loading></Loading>}
            {employeeError && (
                <ErrorAlert
                    title="Error loading data"
                    message="Could not load the required data from the server"
                ></ErrorAlert>
            )}
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
                                if (el.status === 'ACTIVE') {
                                    return (
                                        <Tr _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }} key={idx}>
                                            <Td>
                                                {el.employee?.first_name} {el.employee?.last_name}
                                            </Td>
                                            <Td>{el.allocation} %</Td>
                                            <Td>
                                                <Button onClick={(e) => archiveTimesheet(el, e)}>x</Button>
                                            </Td>
                                        </Tr>
                                    );
                                }
                            })}
                            {state.formStatus == 'ERROR' ? <ErrorAlert></ErrorAlert> : <Box></Box>}
                            {state.formStatus == 'ERROR' ? <Box>{state.errorMessage}</Box> : <Box></Box>}
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
                            {employees?.map((el, idx) => {
                                return (
                                    <option key={idx} value={el.id}>
                                        {`${el.first_name} ${el.last_name}`}
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
                                setState({
                                    ...state,
                                    timesheetName: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Input
                            placeholder="Description"
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    description: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                    <FormControl isInvalid={!(state.allocation > 0 && state.allocation <= 100)}>
                        <FormLabel>Allocation</FormLabel>
                        <Input
                            placeholder="0"
                            onChange={(e) =>
                                setState({
                                    ...state,
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
                    {state.formStatus == 'ERROR' ? <ErrorAlert></ErrorAlert> : <Box></Box>}
                    {state.formStatus == 'ERROR' ? <Box>{state.errorMessage}</Box> : <Box></Box>}
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default TimesheetTable;
