import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Checkbox, FormLabel, Input, Select } from "@chakra-ui/react"
import { Employee, Timesheet } from "@/lib/types/apiTypes"
import _ from "lodash"
import {
    FormContainer,
    FormField,
    SubmitButton,
    toggleArchived,
    useSuccessErrorToast,
} from "./utils"
import { ApiUpdateResponse } from "@/lib/types/hooks"

const convertTimesheet = ({
    name,
    employee,
    rate,
    allocation,
    project,
    ...rest
}: Partial<Timesheet>): Timesheet => {
    if (
        !_.isUndefined(name) &&
        !_.isUndefined(employee) &&
        !_.isUndefined(rate) &&
        !_.isUndefined(allocation) &&
        !_.isUndefined(project)
    ) {
        return { name, employee, rate, allocation, project, ...rest }
    }
    throw Error("Form error, missing required fields")
}

type TimesheetFormProps = {
    timesheet: Partial<Timesheet>
    employees: Employee[]
    onSubmit: (timesheet: Timesheet) => Promise<ApiUpdateResponse<Timesheet>>
}

const TimesheetForm = ({
    timesheet,
    employees,
    onSubmit,
}: TimesheetFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" })

    const employeeById = (id: number) => employees.find((e) => e.id === id)

    const { successToast, errorToast } = useSuccessErrorToast(
        "Timesheet saved.",
        "Error saving timesheet."
    )

    const submit = handleSubmit(async (data) => {
        setIsLoading(true)
        const { isSuccess } = await onSubmit(
            convertTimesheet({ ...timesheet, ...data })
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
                <FormField field={"employee"} errors={errors}>
                    <FormLabel>Employee</FormLabel>
                    <Select
                        {...register("employee", {
                            required: "This is required",
                            setValueAs: (id) => employeeById(Number(id)),
                        })}
                        defaultValue={timesheet?.employee?.id}
                        placeholder={" "}
                    >
                        {employees.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.firstName} {e.lastName}
                            </option>
                        ))}
                    </Select>
                </FormField>
                <FormField field={"name"} errors={errors}>
                    <FormLabel>Name</FormLabel>
                    <Input
                        {...register("name", {
                            required: "This is required",
                        })}
                        defaultValue={timesheet.name}
                    />
                </FormField>
                <FormField field={"description"} errors={errors}>
                    <FormLabel>Description</FormLabel>
                    <Input
                        {...register("description")}
                        defaultValue={timesheet.description}
                    />
                </FormField>
                <FormField field={"allocation"} errors={errors}>
                    <FormLabel>Allocation</FormLabel>
                    <Input
                        type="number"
                        {...register("allocation", {
                            required: "This is required",
                            valueAsNumber: true,
                        })}
                        defaultValue={timesheet.allocation}
                    />
                </FormField>
                <FormField field={"rate"} errors={errors}>
                    <FormLabel>Rate</FormLabel>
                    <Input
                        type="number"
                        {...register("rate", {
                            required: "This is required",
                            valueAsNumber: true,
                        })}
                        defaultValue={timesheet.rate}
                    />
                </FormField>
                <FormField field={"status"} errors={errors}>
                    <FormLabel>Archived</FormLabel>
                    <Checkbox
                        onChange={(event) =>
                            toggleArchived(event.target.checked, setValue)
                        }
                        defaultChecked={timesheet.status === "ARCHIVED"}
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

export default TimesheetForm
