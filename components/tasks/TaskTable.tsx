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
import { taskEndpointURL } from '@/lib/const';
import { ProjectDTO, TaskDTO } from '@/lib/types/dto';

interface TaskTableProps {
    project?: ProjectDTO;
}

function TaskTable({ project }: TaskTableProps): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState<TaskDTO>({
        name: '',
        description: '',
        project: project,
    });
    const [formState, setFormState] = useState<FormStatus>(FormStatus.IDLE);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const taskRequest = useData<TaskDTO[]>(taskEndpointURL, { projectId: `${project?.id}` });
    const { mutate } = useSWRConfig();

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        setFormState(FormStatus.LOADING);
        try {
            await fetch.post(taskEndpointURL.toString(), state);
            mutate(`${taskEndpointURL}?projectId=${project?.id}`);
            setFormState(FormStatus.SUCCESS);
            onClose();
        } catch (error) {
            setFormState(FormStatus.ERROR);
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
            {taskRequest.isLoading && <Loading></Loading>}
            {taskRequest.isError && (
                <ErrorAlert
                    title="Error loading data"
                    message="Could not load the required data from the server"
                ></ErrorAlert>
            )}
            <Heading as="h2" size="md">
                Tasks
            </Heading>
            {taskRequest.data && taskRequest.data.length == 0 && (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    No tasks in this project.
                    <br />
                    To add a task click the button below.
                </Box>
            )}
            {taskRequest.data && taskRequest.data.length > 0 && (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {taskRequest.data?.map((task, idx) => (
                                <Tr _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }} key={idx}>
                                    <Td>{task.name}</Td>
                                    <Td>
                                        <Button>x</Button>
                                    </Td>
                                </Tr>
                            ))}
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
                <ModalContent px="0.5rem">
                    <ModalHeader>Add task to project</ModalHeader>
                    <ModalCloseButton />
                    <FormControl isInvalid={!state.name} isRequired>
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
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button colorScheme="gray" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                    {formState == 'ERROR' ? (
                        <>
                            <ErrorAlert></ErrorAlert>
                            <Box>{errorMessage}</Box>
                        </>
                    ) : null}
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default TaskTable;
