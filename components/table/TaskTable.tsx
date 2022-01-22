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
import ErrorAlert from '../common/ErrorAlert';
import { ProjectDTO, TaskDTO } from '@/lib/types/dto';
import { postTask } from '@/lib/utils/apiRequests';

interface TaskTableProps {
    project: ProjectDTO;
    tasks: TaskDTO[];
}

function TaskTable({ project, tasks }: TaskTableProps): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState<TaskDTO>({
        name: '',
        description: '',
        project: project,
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await postTask(state);
            onClose();
        } catch (error) {
            setErrorMessage(error.toString);
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
                Tasks
            </Heading>
            {tasks ? (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th />
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tasks.map((task, idx) => (
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
            ) : (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    No tasks in this project.
                    <br />
                    To add a task click the button below.
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

export default TaskTable;
