import { ProjectDTO, TaskDTO } from '@/lib/types/dto';
import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tbody } from '@chakra-ui/react';
import { Table, Td, Th, Thead, Tr } from '@chakra-ui/table';
import React, { useState } from 'react';
import { TaskForm } from '../form/TaskForm';

interface TaskTableProps {
    project: ProjectDTO;
    tasks: TaskDTO[];
}

function TaskTable({ project, tasks }: TaskTableProps): JSX.Element {
    const [displayNewTaskForm, setDisplayNewTaskForm] = useState(false);

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
                <Button colorScheme="blue" onClick={() => setDisplayNewTaskForm(true)}>
                    Add Task
                </Button>
            </Flex>
            <Modal isOpen={displayNewTaskForm} onClose={() => setDisplayNewTaskForm(false)}>
                <ModalOverlay />
                <ModalContent px="0.5rem">
                    <ModalHeader>Add task to project</ModalHeader>
                    <ModalCloseButton />
                    <TaskForm project={project} onClose={() => setDisplayNewTaskForm(false)} />
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default TaskTable;
