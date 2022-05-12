import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTasks } from "@/lib/hooks/useTasks"
import { Project, Task } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import { Box } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import {
    CheckBoxField,
    FormContainer,
    FormInputField,
    FromButtons,
} from "../common/FormFields"

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

    const handleSubmit = (event: React.MouseEvent) => {
        try {
            event.preventDefault()
            const updatedTask = validateTaskFields(taskFields, projectId)
            onSubmit(updatedTask)
        } catch (error) {
            errorHandler(error as Error)
        }
    }
    return (
        <form>
            <FormContainer>
                <FormInputField
                    label={"Name"}
                    value={taskFields?.name || ""}
                    placeholder={"Task name"}
                    isRequired={true}
                    isInvalid={!taskFields.name}
                    onChange={(event) =>
                        setTaskFields({
                            ...taskFields,
                            name: event.target.value,
                        })
                    }
                    testId={"form-field-name"}
                />
                <FormInputField
                    label={"Description"}
                    value={taskFields?.description || ""}
                    placeholder={"Description"}
                    onChange={(event) =>
                        setTaskFields({
                            ...taskFields,
                            description: event.target.value,
                        })
                    }
                    testId={"form-field-description"}
                />
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
                <FromButtons onSubmit={handleSubmit} onCancel={onCancel} />
                {errorMessage && (
                    <>
                        <ErrorAlert />
                        <Box>{errorMessage}</Box>
                    </>
                )}
            </FormContainer>
        </form>
    )
}

export const CreateTaskForm = (props: CreateTaskFormProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { postTask } = useUpdateTasks(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (task: Task) => {
        const newTask = await postTask(task, errorHandler)
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
    const { user } = useContext(UserContext)
    const { putTask } = useUpdateTasks(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (task: Task) => {
        const updatedTask = await putTask(task, errorHandler)
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
