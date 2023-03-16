import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTasks } from "@/lib/hooks/useUpdate"
import { Project, Task } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
} from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import { CheckBoxField, FormContainer } from "../common/FormFields"
import { taskFieldMetadata } from "@/lib/types/typeMetadata"
import FormButtons from "../common/FormButtons"
import { StyledButton } from "../common/Buttons"
import { useProjects } from "@/lib/hooks/useList"

interface ICreateTaskForm extends FormBase<Task> {
    project?: Project
}

interface IEditTaskForm extends ICreateTaskForm {
    task: Task
}

interface ITaskForm extends ICreateTaskForm {
    task?: Task
    onSubmit: (task: Task) => void
}

type TaskFields = Partial<Task> & { project?: Project; billable: boolean }

const validateTaskFields = (fields: TaskFields): Task => {
    const { name, project, billable } = fields

    if (name && project && typeof billable !== "undefined") {
        return {
            ...fields,
            project,
            name,
            billable,
        }
    }

    throw Error("Invalid task form: missing required fields")
}

const TaskForm = ({
    task: taskOrNull,
    onSubmit,
    onCancel,
    project,
}: ITaskForm): JSX.Element => {
    const [taskFields, setTaskFields] = useState<TaskFields>(
        taskOrNull || { project, billable: true }
    )

    const { user } = useContext(UserContext)
    const projectResponse = useProjects(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const abortSubmission = onCancel && onCancel

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const updatedTask = validateTaskFields(taskFields)
            onSubmit(updatedTask)
        } catch (error) {
            errorHandler(error as Error)
        }
    }

    const onProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(event.target.value, 10)
        if (!isNaN(value) && projectResponse.isSuccess) {
            const selectedProject = projectResponse.data.find(
                (pro) => pro.id === value
            )
            setTaskFields({
                ...taskFields,
                project: selectedProject,
            })
        }
    }

    return (
        <Flex flexDirection="column">
            <form onSubmit={handleSubmit}>
                <FormContainer>
                    {!project && projectResponse.isSuccess && (
                        <FormControl
                            isRequired={taskFieldMetadata.project.required}
                        >
                            <FormLabel>Project</FormLabel>
                            <Select
                                value={taskFields?.project?.id || ""}
                                placeholder={"Select project"}
                                onChange={onProjectChange}
                                data-testid={"form-field-project"}
                            >
                                {projectResponse.data.map((pro) => (
                                    <option
                                        key={pro.name + pro.id}
                                        value={pro.id}
                                    >
                                        {pro.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    )}
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
                    <FormButtons>
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
                    </FormButtons>
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

export const CreateTaskForm = (props: ICreateTaskForm): JSX.Element => {
    const { user } = useContext(UserContext)
    const { post } = useUpdateTasks(user)

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

export const EditTaskForm = (props: IEditTaskForm): JSX.Element => {
    const { user } = useContext(UserContext)
    const { put } = useUpdateTasks(user)

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
