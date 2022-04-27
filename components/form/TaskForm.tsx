import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTasks } from "@/lib/hooks/useTasks"
import { Project, Task } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import React, { useContext, useState } from "react"
import {
    CheckBoxField,
    FormAlerts,
    FormContainer,
    FormInputField,
    FromButtons,
} from "../common/FormFields"

type TaskFormProps = FormBase<Task> & {
    project: Project
    projectId: number
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

export function CreateTaskForm({
    project,
    projectId,
    afterSubmit,
    onCancel,
}: TaskFormProps): JSX.Element {
    const [taskFields, setTaskFields] = useState<TaskFields>({
        project,
        billable: true,
    })
    const { user } = useContext(UserContext)
    const { postTask } = useUpdateTasks(user)

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
            <FormContainer>
                <FormInputField
                    label={"Name"}
                    placeholder={"Task name"}
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
                <FromButtons onSubmit={onSubmit} onCancel={onCancel} />
            </FormContainer>
            {errorMessage && <FormAlerts errorMessage={errorMessage} />}
        </>
    )
}
