import { useUpdateTasks } from "@/lib/hooks/useTasks"
import { Project, Task } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import React, { useState } from "react"
import {
    CheckBoxField,
    FormAlerts,
    FormContainer,
    FormFieldsContainer,
    FormInputField,
    FromButtons,
} from "../common/FormFields"

type CreateTaskFormProps = FormBase<Task> & {
    project: Project
    projectId: number
}

type EditTaskFormProps = CreateTaskFormProps & {
    task: Task
    taskId: number
}

type TaskFormProps = CreateTaskFormProps & {
    task?: Task
    taskId?: number
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
    project,
    projectId,
    onSubmit,
    onCancel,
}: TaskFormProps): JSX.Element {
    const [taskFields, setTaskFields] = useState<TaskFields>(
        taskOrNull || {
            project,
            billable: true,
        }
    )

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const abortSubmission = onCancel && onCancel

    const formOnSubmit = (event: React.MouseEvent) => {
        event.preventDefault()
        try {
            const task = validateTaskFields(taskFields, projectId)
            onSubmit(task)
        } catch (error) {
            errorHandler(error as Error)
        }
    }

    return (
        <FormContainer>
            <FormFieldsContainer>
                <FormInputField
                    label={"Name"}
                    placeholder={"Task name"}
                    value={taskFields.name || ""}
                    isRequired={true}
                    isInvalid={!taskFields.name}
                    formErrorMessage={"Task name cannot be empty."}
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
                    placeholder={"Description"}
                    value={taskFields.description || ""}
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
                <FromButtons
                    onSubmit={formOnSubmit}
                    onCancel={abortSubmission}
                />
            </FormFieldsContainer>
            {errorMessage && <FormAlerts errorMessage={errorMessage} />}
        </FormContainer>
    )
}

export const CreateTaskForm = (props: CreateTaskFormProps): JSX.Element => {
    const { postTask } = useUpdateTasks()

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (task: Task) => {
        const newTask = await postTask(task, errorHandler)
        return props.afterSubmit && props.afterSubmit(newTask)
    }

    return (
        <>
            <TaskForm {...props} onSubmit={onSubmit} />
            {errorMessage && <FormAlerts errorMessage={errorMessage} />}
        </>
    )
}

export const EditTaskForm = (props: EditTaskFormProps): JSX.Element => {
    const { putTask } = useUpdateTasks()

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (task: Task) => {
        const updatedTask = await putTask(task, errorHandler)
        return props.afterSubmit && props.afterSubmit(updatedTask)
    }

    return (
        <>
            <TaskForm {...props} onSubmit={onSubmit} />
            {errorMessage && <FormAlerts errorMessage={errorMessage} />}
        </>
    )
}
