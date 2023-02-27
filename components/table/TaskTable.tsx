import { useUpdateTasks } from "@/lib/hooks/useUpdate"
import { Project, Task } from "@/lib/types/apiTypes"
import { Box } from "@chakra-ui/layout"
import {
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Tbody,
} from "@chakra-ui/react"
import { Table, Td, Th, Thead, Tr } from "@chakra-ui/table"
import { User } from "firebase/auth"
import React, { useState } from "react"
import { StyledButton, RemoveIconButton } from "../common/Buttons"
import ErrorAlert from "../common/ErrorAlert"
import FormButtons from "../common/FormButtons"
import FormSection from "../common/FormSection"
import { CreateTaskForm, EditTaskForm } from "../form/TaskForm"

interface TaskRowProps {
    task: Task
    onClick?: () => void
    user: User
}

function TaskRow({ task, onClick, user }: TaskRowProps): JSX.Element {
    const { put } = useUpdateTasks(user)

    const [errorMessage, setErrorMessage] = useState<string>()
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)
    const archiveTask = () => put({ ...task, status: "ARCHIVED" }, errorHandler)

    const onRemove = (event: React.MouseEvent) => {
        event.stopPropagation()
        archiveTask()
    }

    return (
        <>
            <Tr
                _hover={{
                    backgroundColor: "#6f6f6f",
                    color: "whitesmoke",
                    cursor: "pointer",
                }}
                onClick={onClick}
            >
                <Td>{task.name}</Td>
                <Td display="flex" justifyContent="end">
                    <RemoveIconButton aria-label="Remove" onClick={onRemove} />
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
    user: User
}

function TaskTable({ project, tasks, user }: TaskTableProps): JSX.Element {
    const [displayNewTaskForm, setDisplayNewTaskForm] = useState(false)
    const [taskToEdit, setTaskToEdit] = useState<Task>()

    return (
        <FormSection header="Tasks">
            <>
                {tasks.filter((task) => task.status !== "ARCHIVED").length ? (
                    <Box borderWidth="1px" padding="1rem" marginBottom="1rem">
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
                                                onClick={() =>
                                                    setTaskToEdit(task)
                                                }
                                                user={user}
                                            />
                                        )
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                ) : (
                    <Box borderWidth="1px" padding="1rem" marginBottom="1rem">
                        No tasks in this project.
                        <br />
                        To add a task click the button below.
                    </Box>
                )}
                {project.id ? (
                    <Box>
                        <FormButtons>
                            <StyledButton
                                buttontype="add"
                                name="Task"
                                onClick={() => setDisplayNewTaskForm(true)}
                            />
                        </FormButtons>
                        <Modal
                            isOpen={displayNewTaskForm}
                            onClose={() => setDisplayNewTaskForm(false)}
                        >
                            <ModalOverlay />
                            <ModalContent
                                paddingX="1rem"
                                paddingBottom="1rem"
                                backgroundColor="whitesmoke"
                            >
                                <ModalHeader>Add task to project</ModalHeader>
                                <ModalCloseButton />
                                <CreateTaskForm
                                    project={project}
                                    projectId={project.id}
                                    afterSubmit={(taskUpdate) =>
                                        taskUpdate.isSuccess &&
                                        setDisplayNewTaskForm(false)
                                    }
                                    onCancel={() =>
                                        setDisplayNewTaskForm(false)
                                    }
                                    user={user}
                                />
                            </ModalContent>
                        </Modal>
                        <Modal
                            isOpen={Boolean(taskToEdit)}
                            onClose={() => setTaskToEdit(undefined)}
                        >
                            <ModalOverlay />
                            <ModalContent
                                paddingX="1rem"
                                paddingBottom="1rem"
                                backgroundColor="whitesmoke"
                            >
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
                                        onCancel={() =>
                                            setTaskToEdit(undefined)
                                        }
                                        user={user}
                                    />
                                )}
                            </ModalContent>
                        </Modal>
                    </Box>
                ) : null}
            </>
        </FormSection>
    )
}

export default TaskTable
