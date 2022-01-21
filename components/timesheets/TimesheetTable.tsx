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
import * as fetch from '@/lib/utils/fetch';
import ErrorAlert from '../common/ErrorAlert';
import useData from '@/lib/hooks/useData';
import Loading from '../common/Loading';
import { FormStatus } from '../projects/NewProject/ProjectForm';
import { employeeEndpointURL, timeSheetURL } from '@/lib/const';
import { TimesheetDTO, ProjectDTO, EmployeeDTO } from '@/lib/types/dto';

type TimesheetTableProps = {
    timesheets?: TimesheetDTO[];
    project?: ProjectDTO;
};

type StateType = {
    user: EmployeeDTO;
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

    const employeesRequest = useData<EmployeeDTO[]>(employeeEndpointURL);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/timesheet`;
    const { mutate } = useSWRConfig();

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        const createTimesheetRequest: TimesheetDTO = {
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
            await fetch.post(timeSheetURL.toString(), createTimesheetRequest);
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

    const archiveTimesheet = async (timesheet: TimesheetDTO, e: React.MouseEvent) => {
        e.preventDefault();
        const createTimesheetRequest: TimesheetDTO = {
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
            const employee = employeesRequest.data?.find((el) => el.id === Number(id));
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
            {employeesRequest.isLoading && <Loading></Loading>}
            {employeesRequest.isError && (
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
                            {timesheets.map((timesheet, idx) => {
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
                            {state.formStatus == 'ERROR' ? (
                                <>
                                    <ErrorAlert></ErrorAlert>
                                    <Box>{state.errorMessage}</Box>
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
                            {employeesRequest.data?.map((employee, idx) => {
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
