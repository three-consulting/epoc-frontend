import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Checkbox, FormLabel, Input, Select, useToast } from "@chakra-ui/react"
import { Customer, Employee, Project } from "@/lib/types/apiTypes"
import _ from "lodash"
import { FormContainer, FormField, SubmitButton, toggleArchived } from "./utils"
import { ApiUpdateResponse } from "@/lib/types/hooks"

type ProjectFormProps = {
    project: Partial<Project>
    customers: Customer[]
    employees: Employee[]
    onSubmit: (project: Project) => Promise<ApiUpdateResponse<Project>>
}

const convertProject = ({
    name,
    managingEmployee,
    customer,
    startDate,
    ...rest
}: Partial<Project>): Project => {
    if (
        !_.isUndefined(name) &&
        !_.isUndefined(managingEmployee) &&
        !_.isUndefined(customer) &&
        !_.isUndefined(startDate)
    ) {
        return { name, managingEmployee, customer, startDate, ...rest }
    }
    throw Error("Form error, missing required fields")
}

const ProjectForm = ({
    project,
    employees,
    customers,
    onSubmit,
}: ProjectFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" })

    const employeeById = (id: number) => employees.find((e) => e.id === id)
    const customerById = (id: number) => customers.find((c) => c.id === id)

    const validateEndDate = (startDate: Date, endDate: Date) =>
        endDate > startDate || "The end date must be after the start date"

    const toast = useToast()

    const successToast = () =>
        toast({
            title: "Project saved.",
            status: "success",
            duration: 4000,
            isClosable: true,
        })

    const errorToast = () =>
        toast({
            title: "Error saving project.",
            status: "error",
            duration: 4000,
            isClosable: true,
        })

    const submit = handleSubmit(async (data) => {
        setIsLoading(true)
        const { isSuccess } = await onSubmit(
            convertProject({ ...project, ...data })
        )
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
                        defaultValue={project.name}
                    />
                </FormField>
                <FormField field={"description"} errors={errors}>
                    <FormLabel>Description</FormLabel>
                    <Input
                        {...register("description")}
                        defaultValue={project.description}
                    />
                </FormField>
                <FormField field={"customer"} errors={errors}>
                    <FormLabel>Customer</FormLabel>
                    <Select
                        {...register("customer", {
                            required: "This is required",
                            setValueAs: (id) => customerById(Number(id)),
                        })}
                        defaultValue={project?.customer?.id}
                        placeholder={" "}
                    >
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </Select>
                </FormField>
                <FormField field={"startDate"} errors={errors}>
                    <FormLabel>Start date</FormLabel>
                    <Input
                        {...register("startDate", { valueAsDate: true })}
                        type={"date"}
                        defaultValue={project.startDate}
                    />
                </FormField>
                <FormField field={"endDate"} errors={errors}>
                    <FormLabel>End date</FormLabel>
                    <Input
                        {...register("endDate", {
                            validate: (endDate, { startDate }) =>
                                !endDate || validateEndDate(startDate, endDate),
                        })}
                        type={"date"}
                        defaultValue={project.endDate}
                    />
                </FormField>
                <FormField field={"managingEmployee"} errors={errors}>
                    <FormLabel>Managing Employee</FormLabel>
                    <Select
                        {...register("managingEmployee", {
                            required: "This is required",
                            setValueAs: (id) => employeeById(Number(id)),
                        })}
                        defaultValue={project?.managingEmployee?.id}
                        placeholder={" "}
                    >
                        {employees.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.firstName} {e.lastName}
                            </option>
                        ))}
                    </Select>
                </FormField>
                <FormField field={"status"} errors={errors}>
                    <FormLabel>Archived</FormLabel>
                    <Checkbox
                        onChange={(event) =>
                            toggleArchived(event.target.checked, setValue)
                        }
                        defaultChecked={project.status === "ARCHIVED"}
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

export default ProjectForm
