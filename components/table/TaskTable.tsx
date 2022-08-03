import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTasks } from "@/lib/hooks/useUpdate"
import { Project, Task } from "@/lib/types/apiTypes"
import { Button } from "@chakra-ui/button"
import { Box, Flex, Heading } from "@chakra-ui/layout"
import {
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Tbody,
} from "@chakra-ui/react"
import { Table, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React, { useContext, useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import { CreateTaskForm, EditTaskForm } from "../form/TaskForm"

interface TaskRowProps {
    task: Task
    onClick?: () => void
}

function TaskRow({ task, onClick }: TaskRowProps): JSX.Element {
    const { user } = useContext(UserContext)
    const { put } = useUpdateTasks(user)

    const [errorMessage, setErrorMessage] = useState<string>()
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)
    const archiveTask = () => put({ ...task, status: "ARCHIVED" }, errorHandler)

    return (
        <>
            <Tr
                _hover={{ backgroundColor: "gray.200", cursor: "pointer" }}
                onClick={onClick}
            >
                <Td>{task.name}</Td>
                <Td>
                    <Button
                        onClick={(event) => {
                            event.stopPropagation()
                            archiveTask()
                        }}
                    >
                        x
                    </Button>
                </Td>
            </Tr>
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

interface TaskTableProps {
    project: Project
    tasks: Task[]
}

function TaskTable({ project, tasks }: TaskTableProps): JSX.Element {
    const [displayNewTaskForm, setDisplayNewTaskForm] = useState(false)
    const [taskToEdit, setTaskToEdit] = useState<Task>()

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
            {tasks.filter((task) => task.status !== "ARCHIVED").length ? (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th />
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tasks.map(
                                (task) =>
                                    task.status !== "ARCHIVED" && (
                                        <TaskRow
                                            task={task}
                                            key={`${task.id}`}
                                            onClick={() => setTaskToEdit(task)}
                                        />
                                    )
                            )}
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
            {project.id ? (
                <>
                    <Flex flexDirection="row-reverse">
                        <Button
                            colorScheme="blue"
                            onClick={() => setDisplayNewTaskForm(true)}
                        >
                            Add Task
                        </Button>
                    </Flex>
                    <Modal
                        isOpen={displayNewTaskForm}
                        onClose={() => setDisplayNewTaskForm(false)}
                    >
                        <ModalOverlay />
                        <ModalContent px="0.5rem">
                            <ModalHeader>Add task to project</ModalHeader>
                            <ModalCloseButton />
                            <CreateTaskForm
                                project={project}
                                projectId={project.id}
                                afterSubmit={(taskUpdate) =>
                                    taskUpdate.isSuccess &&
                                    setDisplayNewTaskForm(false)
                                }
                                onCancel={() => setDisplayNewTaskForm(false)}
                            />
                        </ModalContent>
                    </Modal>
                    <Modal
                        isOpen={Boolean(taskToEdit)}
                        onClose={() => setTaskToEdit(undefined)}
                    >
                        <ModalOverlay />
                        <ModalContent px="0.5rem">
                            <ModalHeader>Edit task</ModalHeader>
                            <ModalCloseButton />
                            {taskToEdit && (
                                <EditTaskForm
                                    task={taskToEdit}
                                    project={project}
                                    projectId={project.id}
                                    afterSubmit={(taskUpdate) =>
                                        taskUpdate.isSuccess &&
                                        setTaskToEdit(undefined)
                                    }
                                    onCancel={() => setTaskToEdit(undefined)}
                                />
                            )}
                        </ModalContent>
                    </Modal>
                </>
            ) : null}
        </Flex>
    )
}

export default TaskTable
