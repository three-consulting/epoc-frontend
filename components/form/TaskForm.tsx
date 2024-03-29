import { useUpdateTasks } from "@/lib/hooks/useUpdate"
import { Project, Task } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import { Box, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react"
import React, { useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import { CheckBoxField, FormContainer } from "../common/FormFields"
import { taskFieldMetadata } from "@/lib/types/typeMetadata"
import StyledButtons from "../common/StyledButtons"
import { StyledButton } from "../common/Buttons"

type CreateTaskFormProps = FormBase<Task> & {
    project: Project
    projectId: number
}

type EditTaskFormProps = CreateTaskFormProps & {
    task: Task
}

type TaskFormProps = CreateTaskFormProps & {
    task?: Task
    onSubmit: (task: Task) => void
}

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

function TaskForm({
    task: taskOrNull,
    onSubmit,
    onCancel,
    project,
    projectId,
}: TaskFormProps): JSX.Element {
    const [taskFields, setTaskFields] = useState<TaskFields>(
        taskOrNull || { project, billable: true }
    )

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const abortSubmission = onCancel && onCancel

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const updatedTask = validateTaskFields(taskFields, projectId)
            onSubmit(updatedTask)
        } catch (error) {
            errorHandler(error as Error)
        }
    }

    return (
        <Flex flexDirection="column">
            <form onSubmit={handleSubmit}>
                <FormContainer>
                    <FormControl isRequired={taskFieldMetadata.name.required}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            value={taskFields?.name || ""}
                            placeholder={"Task name"}
                            onChange={(event) =>
                                setTaskFields({
                                    ...taskFields,
                                    name: event.target.value,
                                })
                            }
                            data-testid={"form-field-name"}
                        />
                    </FormControl>
                    <FormControl
                        isRequired={taskFieldMetadata.description.required}
                    >
                        <FormLabel>Description</FormLabel>
                        <Input
                            value={taskFields?.description || ""}
                            placeholder={"Description"}
                            onChange={(event) =>
                                setTaskFields({
                                    ...taskFields,
                                    description: event.target.value,
                                })
                            }
                            data-testid={"form-field-description"}
                        />
                    </FormControl>
                    <CheckBoxField
                        label={"Billable"}
                        isChecked={taskFields.billable}
                        onChange={(event) =>
                            setTaskFields({
                                ...taskFields,
                                billable: event.target.checked,
                            })
                        }
                        testId={"form-field-billable"}
                    />
                    <StyledButtons>
                        <StyledButton
                            buttontype="submit"
                            type="submit"
                            data-testid="form-button-submit"
                        />
                        <StyledButton
                            buttontype="cancel"
                            onClick={abortSubmission}
                            data-testid="form-button-cancel"
                        />
                    </StyledButtons>
                    {errorMessage && (
                        <>
                            <ErrorAlert />
                            <Box>{errorMessage}</Box>
                        </>
                    )}
                </FormContainer>
            </form>
        </Flex>
    )
}

export const CreateTaskForm = (props: CreateTaskFormProps): JSX.Element => {
    const { post } = useUpdateTasks()

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (task: Task) => {
        const newTask = await post(task, errorHandler)
        return props.afterSubmit && props.afterSubmit(newTask)
    }

    return (
        <>
            <TaskForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

export const EditTaskForm = (props: EditTaskFormProps): JSX.Element => {
    const { put } = useUpdateTasks()
    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (task: Task) => {
        const updatedTask = await put(task, errorHandler)
        return props.afterSubmit && props.afterSubmit(updatedTask)
    }

    return (
        <>
            <TaskForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}
