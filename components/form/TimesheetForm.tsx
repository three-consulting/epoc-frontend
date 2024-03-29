import { useUpdateTimesheets } from "@/lib/hooks/useUpdate"
import { Employee, Project, Timesheet } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import {
    Box,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
} from "@chakra-ui/react"
import React, { useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import { timesheetFieldMetadata } from "@/lib/types/typeMetadata"
import StyledButtons from "../common/StyledButtons"
import { StyledButton } from "../common/Buttons"

type CreateTimesheetFormProps = FormBase<Timesheet> & {
    employees: Employee[]
    project: Project
    projectId: number
}

type EditTimesheetFormProps = CreateTimesheetFormProps & {
    timesheet: Timesheet
    timesheetId: number
}

type TimesheetFormProps = CreateTimesheetFormProps & {
    timesheet?: Timesheet
    timesheetId?: number
    onSubmit: (timesheet: Timesheet) => void
}

type TimesheetFields = Partial<Timesheet> & {
    project: Project
}

const validateTimesheetFields = (
    fields: TimesheetFields,
    projectId: number
): Timesheet => {
    const { name, rate, allocation, project, employee } = fields
    if (
        name &&
        rate !== undefined &&
        allocation !== undefined &&
        project &&
        employee
    ) {
        return {
            ...fields,
            project: { ...project, id: projectId },
            name,
            rate,
            allocation,
            employee,
        }
    }
    throw Error("Invalid timesheet form: Missing required fields")
}

function TimesheetForm({
    timesheet: timesheetOrNull,
    project,
    projectId,
    employees,
    onSubmit,
    onCancel,
}: TimesheetFormProps): JSX.Element {
    const [timesheetFields, setTimesheetFields] = useState<TimesheetFields>(
        timesheetOrNull || { project }
    )
    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const setEmployee = (event: React.FormEvent<HTMLSelectElement>) => {
        event.preventDefault()
        const id = Number(event.currentTarget.value)
        if (id && employees) {
            const employee = employees.find(
                (employeeIterator) => employeeIterator.id === id
            )
            if (employee) {
                setTimesheetFields({
                    ...timesheetFields,
                    employee: { ...employee },
                    project: { ...project },
                })
            } else {
                throw Error(
                    `Error timesheet form could not find employee with id ${id}.`
                )
            }
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const timesheet = validateTimesheetFields(
                timesheetFields,
                projectId
            )
            onSubmit(timesheet)
        } catch (error) {
            errorHandler(error as Error)
        }
    }

    const maximumAllocation = 100

    const invalidAllocation =
        (timesheetFields.allocation &&
            (timesheetFields.allocation < 0 ||
                timesheetFields.allocation > maximumAllocation)) ||
        false

    const rateIsValid =
        timesheetFields.rate !== undefined && timesheetFields.rate >= 0

    const abortSubmission = onCancel && onCancel

    const activeEmployees = employees.filter(
        (employee) => employee.status === "ACTIVE"
    )

    return (
        <Flex flexDirection="column">
            <form onSubmit={handleSubmit}>
                <Box paddingX="1.5rem" paddingY="1rem">
                    <FormControl isRequired>
                        <FormLabel>User</FormLabel>
                        <Select
                            value={timesheetFields.employee?.id || ""}
                            onChange={setEmployee}
                            data-testid="form-field-employee"
                        >
                            {activeEmployees.map((employee) => (
                                <option
                                    key={`${employee.id}`}
                                    value={employee.id}
                                >
                                    {`${employee.firstName} ${employee.lastName}`}
                                </option>
                            ))}
                            <option hidden disabled value="">
                                Select user
                            </option>
                        </Select>
                    </FormControl>
                    <FormControl
                        isRequired={timesheetFieldMetadata.name.required}
                    >
                        <FormLabel>Timesheet Name</FormLabel>
                        <Input
                            value={timesheetFields.name || ""}
                            placeholder="Timesheet Name"
                            onChange={(event) =>
                                setTimesheetFields({
                                    ...timesheetFields,
                                    name: event.target.value,
                                })
                            }
                            data-testid="form-field-name"
                        />
                    </FormControl>
                    <FormControl
                        isRequired={timesheetFieldMetadata.description.required}
                    >
                        <FormLabel>Description</FormLabel>
                        <Input
                            value={timesheetFields.description || ""}
                            placeholder="Description"
                            onChange={(event) =>
                                setTimesheetFields({
                                    ...timesheetFields,
                                    description: event.target.value,
                                })
                            }
                            data-testid="form-field-description"
                        />
                    </FormControl>
                    <FormControl
                        isInvalid={invalidAllocation}
                        isRequired={timesheetFieldMetadata.allocation.required}
                    >
                        <FormLabel>Allocation</FormLabel>
                        <Input
                            type={"number"}
                            value={
                                timesheetFields.allocation === undefined
                                    ? ""
                                    : timesheetFields.allocation
                            }
                            placeholder="0"
                            onChange={(event) =>
                                setTimesheetFields({
                                    ...timesheetFields,
                                    allocation: event.target.value
                                        ? Number(event.target.value)
                                        : undefined,
                                })
                            }
                            data-testid="form-field-allocation"
                        />
                        <FormErrorMessage>
                            Allocation needs to be between 0 and 100 %.
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl
                        isInvalid={
                            !rateIsValid && timesheetFields.rate !== undefined
                        }
                        isRequired={timesheetFieldMetadata.rate.required}
                    >
                        <FormLabel>Rate</FormLabel>
                        <Input
                            type={"number"}
                            value={
                                timesheetFields.rate === undefined
                                    ? ""
                                    : timesheetFields.rate
                            }
                            placeholder="Rate (€/h)"
                            onChange={(event) => {
                                setTimesheetFields({
                                    ...timesheetFields,
                                    rate: event.target.value
                                        ? Number(event.target.value)
                                        : undefined,
                                })
                            }}
                            data-testid="form-field-rate"
                        />
                        <FormErrorMessage
                            hidden={timesheetFields.rate === undefined}
                        >
                            Rate must be a non-negative number.
                        </FormErrorMessage>
                    </FormControl>
                    <StyledButtons>
                        <StyledButton
                            buttontype="submit"
                            isDisabled={!rateIsValid || invalidAllocation}
                            type="submit"
                            data-testid="form-button-submit"
                        />
                        <StyledButton
                            buttontype="cancel"
                            onClick={abortSubmission}
                            data-testid="form-button-cancel"
                        />
                    </StyledButtons>
                </Box>
                {errorMessage && (
                    <>
                        <ErrorAlert />
                        <Box>{errorMessage}</Box>
                    </>
                )}
            </form>
        </Flex>
    )
}

export const CreateTimesheetForm = (
    props: CreateTimesheetFormProps
): JSX.Element => {
    const { post } = useUpdateTimesheets()
    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (timesheet: Timesheet) => {
        const newTimesheet = await post(timesheet, errorHandler)
        return props.afterSubmit && props.afterSubmit(newTimesheet)
    }

    return (
        <>
            <TimesheetForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

export const EditTimesheetForm = (
    props: EditTimesheetFormProps
): JSX.Element => {
    const { put } = useUpdateTimesheets()
    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (timesheet: Timesheet) => {
        const updatedTimesheet = await put(timesheet, errorHandler)
        return props.afterSubmit && props.afterSubmit(updatedTimesheet)
    }

    return (
        <>
            <TimesheetForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}
