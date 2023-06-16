import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Checkbox, FormLabel, Input, useToast } from "@chakra-ui/react"
import { Task } from "@/lib/types/apiTypes"
import _ from "lodash"
import { FormContainer, FormField, SubmitButton, toggleArchived } from "./utils"
import { ApiUpdateResponse } from "@/lib/types/hooks"

type TaskFormProps = {
    task: Partial<Task>
    onSubmit: (task: Task) => Promise<ApiUpdateResponse<Task>>
}

const convertTask = ({
    name,
    project,
    billable,
    ...rest
}: Partial<Task>): Task => {
    if (!_.isUndefined(name) && !_.isUndefined(project)) {
        return { name, project, billable: Boolean(billable), ...rest }
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

    const toast = useToast()

    const successToast = () =>
        toast({
            title: "Task saved.",
            status: "success",
            duration: 4000,
            isClosable: true,
        })

    const errorToast = () =>
        toast({
            title: "Error saving task.",
            status: "error",
            duration: 4000,
            isClosable: true,
        })

    const submit = handleSubmit(async (data) => {
        setIsLoading(true)
        const { isSuccess } = await onSubmit(convertTask({ ...task, ...data }))
        setIsLoading(false)
        if (isSuccess) {
            successToast()
        } else {
            errorToast()
        }
    })

    const [isLoading, setIsLoading] = useState(false)

    return (
        <FormContainer>
            <form onSubmit={submit}>
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
                <SubmitButton
                    disabled={!_.isEmpty(errors)}
                    isLoading={isLoading}
                />
            </form>
        </FormContainer>
    )
}

export default TaskForm
