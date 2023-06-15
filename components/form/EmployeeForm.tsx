import React from "react"
import { useForm } from "react-hook-form"
import { Checkbox, FormLabel, Input, Select } from "@chakra-ui/react"
import { Employee } from "@/lib/types/apiTypes"
import _ from "lodash"
import { FormContainer, FormField, SubmitButton, toggleArchived } from "./utils"

type EmployeeFormProps = {
    employee: Partial<Employee>
    onSubmit: (emloyee: Employee) => Promise<void>
}

const convertEmployee = ({
    firstName,
    lastName,
    email,
    role,
    ...rest
}: Partial<Employee>): Employee => {
    if (firstName && lastName && email && role) {
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

    return (
        <FormContainer>
            <form
                onSubmit={handleSubmit((data) =>
                    onSubmit(convertEmployee({ ...employee, ...data }))
                )}
            >
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
                <SubmitButton disabled={!_.isEmpty(errors)} />
            </form>
        </FormContainer>
    )
}

export default EmployeeForm
