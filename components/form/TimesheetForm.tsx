import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTimesheets } from "@/lib/hooks/useUpdate"
import { Employee, Project, Timesheet } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import {
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
} from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import { timesheetFieldMetadata } from "@/lib/types/typeMetadata"
import FormButtons from "../common/FormButtons"
import { StyledButton } from "../common/Buttons"
import FormSection from "../common/FormSection"
import { useProjects } from "@/lib/hooks/useList"

interface ICreateTimesheetForm extends FormBase<Timesheet> {
    employees: Employee[]
    project?: Project
    projectId?: number
}

interface IEditTimesheetForm extends ICreateTimesheetForm {
    timesheet: Timesheet
    timesheetId: number
}

interface ITimesheetForm extends ICreateTimesheetForm {
    timesheet?: Timesheet
    timesheetId?: number
    onSubmit: (timesheet: Timesheet) => void
}

type TimesheetFields = Partial<Timesheet>

const validateTimesheetFields = (
    fields: TimesheetFields,
    projectId?: number
): Timesheet => {
    const { name, rate, allocation, project, employee } = fields
    if (name && rate !== undefined && allocation && project && employee) {
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

const TimesheetForm = ({
    timesheet,
    project,
    projectId,
    employees,
    onSubmit,
    onCancel,
}: ITimesheetForm): JSX.Element => {
    const [timesheetFields, setTimesheetFields] = useState<TimesheetFields>(
        timesheet || {}
    )
    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const { user } = useContext(UserContext)
    const projectResponse = useProjects(user)

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
                    employee,
                    project,
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
            const sheet = validateTimesheetFields(timesheetFields, projectId)
            onSubmit(sheet)
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

    return (
        <FormSection
            header={timesheetFields.name || " - "}
            errorMessage={errorMessage}
        >
            <Box>
                <form onSubmit={handleSubmit}>
                    {!project && !projectId && projectResponse.isSuccess && (
                        <FormControl isRequired>
                            <FormLabel>Project</FormLabel>
                            <Select
                                value={timesheetFields?.project?.id}
                                onChange={setEmployee}
                                placeholder="Select project"
                                data-testid="form-field-project"
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
                    <FormControl isRequired>
                        <FormLabel>User</FormLabel>
                        <Select
                            value={timesheetFields?.employee?.id}
                            onChange={setEmployee}
                            placeholder="Select employee"
                            data-testid="form-field-employee"
                        >
                            {employees.map((employee) => (
                                <option
                                    key={`${employee.id}`}
                                    value={employee.id}
                                >
                                    {`${employee.firstName} ${employee.lastName}`}
                                </option>
                            ))}
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
                    <FormButtons>
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
                    </FormButtons>
                </form>
            </Box>
        </FormSection>
    )
}

export const CreateTimesheetForm = (
    props: ICreateTimesheetForm
): JSX.Element => {
    const { user } = useContext(UserContext)
    const { post } = useUpdateTimesheets(user)

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

export const EditTimesheetForm = (props: IEditTimesheetForm): JSX.Element => {
    const { user } = useContext(UserContext)
    const { put } = useUpdateTimesheets(user)

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
