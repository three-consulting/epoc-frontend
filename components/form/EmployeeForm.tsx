import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Checkbox, FormLabel, Input, Select, useToast } from "@chakra-ui/react"
import { Employee } from "@/lib/types/apiTypes"
import _ from "lodash"
import { FormContainer, FormField, SubmitButton, toggleArchived } from "./utils"
import { ApiUpdateResponse } from "@/lib/types/hooks"

type EmployeeFormProps = {
    employee: Partial<Employee>
    onSubmit: (emloyee: Employee) => Promise<ApiUpdateResponse<Employee>>
}

const convertEmployee = ({
    firstName,
    lastName,
    email,
    role,
    ...rest
}: Partial<Employee>): Employee => {
    if (
        !_.isUndefined(firstName) &&
        !_.isUndefined(lastName) &&
        !_.isUndefined(email) &&
        !_.isUndefined(role)
    ) {
        return { firstName, lastName, email, role, ...rest }
    }
    throw Error("Form error, missing required fields")
}

const EmployeeForm = ({ employee, onSubmit }: EmployeeFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" })

    const toast = useToast()

    const successToast = () =>
        toast({
            title: "Employee saved.",
            status: "success",
            duration: 4000,
            isClosable: true,
        })

    const errorToast = () =>
        toast({
            title: "Error saving employee.",
            status: "error",
            duration: 4000,
            isClosable: true,
        })

    const submit = handleSubmit(async (data) => {
        setIsLoading(true)
        const { isSuccess } = await onSubmit(
            convertEmployee({ ...employee, ...data })
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
                <FormField field={"firstName"} errors={errors}>
                    <FormLabel>Name</FormLabel>
                    <Input
                        {...register("firstName", {
                            required: "This is required",
                        })}
                        defaultValue={employee.firstName}
                    />
                </FormField>
                <FormField field={"lastName"} errors={errors}>
                    <FormLabel>Last name</FormLabel>
                    <Input
                        {...register("lastName", {
                            required: "This is required",
                        })}
                        defaultValue={employee.lastName}
                    />
                </FormField>
                <FormField field={"email"} errors={errors}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        {...register("email", {
                            required: "This is required",
                        })}
                        defaultValue={employee.email}
                    />
                </FormField>
                <FormField field={"role"} errors={errors}>
                    <FormLabel>Email</FormLabel>
                    <Select
                        {...register("role", {
                            required: "This is required",
                        })}
                        defaultValue={employee.role}
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                    </Select>
                </FormField>
                <FormField field={"archived"} errors={errors}>
                    <FormLabel>Archived</FormLabel>
                    <Checkbox
                        onChange={(event) =>
                            toggleArchived(event.target.checked, setValue)
                        }
                        defaultChecked={employee.status === "ARCHIVED"}
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

export default EmployeeForm
