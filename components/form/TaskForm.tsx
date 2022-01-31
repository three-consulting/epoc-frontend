import { useUpdateTasks } from "@/lib/hooks/useTasks"
import { Project, Task } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import { FormControl, FormLabel, Input, FormErrorMessage, Button, Box, Flex, Checkbox } from "@chakra-ui/react"
import React, { useState } from "react"
import ErrorAlert from "../common/ErrorAlert"

type TaskFields = Partial<Task> & { project: Project; billable: boolean }

const validateTaskFields = (fields: TaskFields, projectId: number): Task => {
    const { name, project, billable } = fields

    if (name && typeof billable !== "undefined") {
        return {
            ...fields,
            project: { ...project, id: projectId },
            name,
            billable,
        }
    }

    throw Error("Invalid task form: missing required fields")
}

type TaskFormProps = FormBase<Task> & {
    project: Project
    projectId: number
}

export function CreateTaskForm({ project, projectId, afterSubmit, onCancel }: TaskFormProps): JSX.Element {
    const [taskFields, setTaskFields] = useState<TaskFields>({
        project,
        billable: true,
    })
    const { postTask } = useUpdateTasks()

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (event: React.MouseEvent) => {
        event.preventDefault()
        try {
            const task = validateTaskFields(taskFields, projectId)
            const newTask = await postTask(task, errorHandler)
            return afterSubmit && afterSubmit(newTask)
        } catch (error) {
            errorHandler(error as Error)
            return null
        }
    }

    return (
        <>
            <div style={{ padding: "20px" }}>
                <FormControl isInvalid={!taskFields.name} isRequired>
                    <FormLabel>Task Name</FormLabel>
                    <Input
                        placeholder="Task Name"
                        onChange={(event) =>
                            setTaskFields({
                                ...taskFields,
                                name: event.target.value,
                            })
                        }
                    />
                    <FormErrorMessage>Task name cannot be empty.</FormErrorMessage>
                </FormControl>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                        placeholder="Description"
                        onChange={(event) =>
                            setTaskFields({
                                ...taskFields,
                                description: event.target.value,
                            })
                        }
                    />
                </FormControl>
                <FormControl py="0.5rem">
                    <Flex flexDirection={"row"} alignItems={"baseline"}>
                        <FormLabel>Billable</FormLabel>
                        <Checkbox
                            isChecked={taskFields.billable}
                            onChange={(event) =>
                                setTaskFields({
                                    ...taskFields,
                                    billable: event.target.checked,
                                })
                            }
                        />
                    </Flex>
                </FormControl>
            </div>
            <div style={{ textAlign: "right", padding: "20px" }}>
                <Button colorScheme="blue" mr={3} onClick={onSubmit}>
                    Submit
                </Button>
                <Button colorScheme="gray" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}
