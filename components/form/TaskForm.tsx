import React from "react"
import { useForm } from "react-hook-form"
import { Checkbox, FormLabel, Input } from "@chakra-ui/react"
import { Task } from "@/lib/types/apiTypes"
import _ from "lodash"
import { FormContainer, FormField, SubmitButton, toggleArchived } from "./utils"

type TaskFormProps = {
    task: Partial<Task>
    onSubmit: (task: Task) => Promise<void>
}

const convertTask = ({
    name,
    project,
    billable,
    ...rest
}: Partial<Task>): Task => {
    if (name && project && billable) {
        return { name, project, billable, ...rest }
    }
    throw Error("Form error, missing required fields")
}

const TaskForm = ({ task, onSubmit }: TaskFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" })

    return (
        <FormContainer>
            <form
                onSubmit={handleSubmit((data) =>
                    onSubmit(convertTask({ ...task, ...data }))
                )}
            >
                <FormField field={"name"} errors={errors}>
                    <FormLabel>Name</FormLabel>
                    <Input
                        {...register("name", {
                            required: "This is required",
                        })}
                        defaultValue={task.name}
                    />
                </FormField>
                <FormField field={"description"} errors={errors}>
                    <FormLabel>Description</FormLabel>
                    <Input
                        {...register("description")}
                        defaultValue={task.description}
                    />
                </FormField>
                <FormField field={"billable"} errors={errors}>
                    <FormLabel>Billable</FormLabel>
                    <Checkbox
                        {...register("billable")}
                        defaultChecked={task.billable}
                    />
                </FormField>
                <FormField field={"archived"} errors={errors}>
                    <FormLabel>Archived</FormLabel>
                    <Checkbox
                        onChange={(event) =>
                            toggleArchived(event.target.checked, setValue)
                        }
                        defaultChecked={task.status === "ARCHIVED"}
                    />
                </FormField>
                <SubmitButton disabled={!_.isEmpty(errors)} />
            </form>
        </FormContainer>
    )
}

export default TaskForm
