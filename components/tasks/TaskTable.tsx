import { components } from '@/lib/types/api';
import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import {
    Checkbox,
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

type TaskTableProps = {
    project?: components['schemas']['ProjectDTO'];
};

type StateType = {
    name: string;
    description: string;
    billable: boolean;
    formStatus: FormStatus;
    errorMessage: string;
};

function TaskTable({ project }: TaskTableProps): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState<StateType>({
        name: '',
        description: '',
        billable: true,
        formStatus: FormStatus.IDLE,
        errorMessage: '',
    });

    const {
        data: tasks,
        isError: taskError,
        isLoading: tasksLoading,
    } = useData<components['schemas']['TaskDTO'][]>('task', { projectId: `${project?.id}` });

    const url = `${process.env.NEXT_PUBLIC_API_URL}/task`;
    const { mutate } = useSWRConfig();

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        const createTaskRequest: components['schemas']['TaskDTO'] = {
            name: state.name,
            description: state.description,
            billable: state.billable,
            project: project,
        };
        setState({
            ...state,
            formStatus: FormStatus.LOADING,
        });
        try {
            await fetch.post(url, createTaskRequest);
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
            {tasksLoading && <Loading></Loading>}
            {taskError && (
                <ErrorAlert
                    title="Error loading data"
                    message="Could not load the required data from the server"
                ></ErrorAlert>
            )}
            <Heading as="h2" size="md">
                Tasks
            </Heading>
            {tasks && tasks?.length == 0 && (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    No tasks in this project.
                    <br />
                    To add a task click the button below.
                </Box>
            )}
            {tasks && tasks?.length !== 0 && (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tasks.map((el, idx) => {
                                return (
                                    <Tr _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }} key={idx}>
                                        <Td>{el.name}</Td>
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
            <Flex flexDirection="row-reverse">
                <Button colorScheme="blue" onClick={onOpen}>
                    Add Task
                </Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent px="1rem">
                    <ModalHeader>Add task to project</ModalHeader>
                    <ModalCloseButton />
                    <FormControl isInvalid={state.name.length === 0} isRequired py="0.5rem">
                        <FormLabel>Task Name</FormLabel>
                        <Input
                            placeholder="Task Name"
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    name: e.target.value,
                                })
                            }
                        />
                        <FormErrorMessage>Task name cannot be empty.</FormErrorMessage>
                    </FormControl>
                    <FormControl py="0.5rem">
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
                    <FormControl py="0.5rem">
                        <Flex flexDirection={'row'} alignItems={'baseline'}>
                            <FormLabel>Billable</FormLabel>
                            <Checkbox
                                defaultChecked={true}
                                onChange={(e) => setState({ ...state, billable: e.target.checked })}
                            />
                        </Flex>
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

export default TaskTable;
