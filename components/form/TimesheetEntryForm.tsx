import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import {
    Task,
    TimeCategory,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
} from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import { FromButtons } from "../common/FormFields"
import { timesheetEntryFieldMetadata } from "@/lib/types/typeMetadata"
import { isError } from "lodash"
import { useUpdate } from "@/lib/hooks/swrInterface"
import { jsDateToShortISODate } from "@/lib/utils/date"

interface TimesheetEntryFormBaseProps extends FormBase<TimesheetEntry> {
    timesheetEntry?: TimesheetEntry
    timesheet: Timesheet
    date?: string
    dates?: Date[]
    timeCategories: TimeCategory[]
    tasks: Task[]
    onSubmit: (entry: TimesheetEntry) => void
}

interface CreateTimesheetEntryFormProps
    extends FormBase<TimesheetEntry | TimesheetEntry[]> {
    timesheet: Timesheet
    projectId: number
    date: string
    dates: Date[]
    timeCategories: TimeCategory[]
    tasks: Task[]
}

interface EditTimesheetEntryFormProps extends FormBase<TimesheetEntry> {
    entry: TimesheetEntry
    timesheet: Timesheet
    projectId: number
    date: string
    timeCategories: TimeCategory[]
    tasks: Task[]
}

type TimesheetEntryFields = Partial<TimesheetEntry> & {
    timesheet: Timesheet
}

const validateTimesheetEntryFields = (
    fields: TimesheetEntryFields
): TimesheetEntry => {
    const { timesheet, quantity, timeCategory, date, task } = fields
    if (!timesheet) {
        throw Error(
            "Invalid timesheet entry form: missing required timesheet field"
        )
    } else if (quantity === undefined || quantity === null) {
        throw Error(
            "Invalid timesheet entry form: missing required quantity field"
        )
    } else if (!timeCategory) {
        throw Error(
            "Invalid timesheet entry form: missing required timeCategory field"
        )
    } else if (!date) {
        throw Error("Invalid timesheet entry form: missing required date field")
    } else if (!task) {
        throw Error("Invalid timesheet entry form: missing required task field")
    }
    return { ...fields, timesheet, quantity, date, timeCategory, task }
}

const TimesheetEntryForm = ({
    timesheetEntry,
    timesheet,
    date,
    timeCategories,
    tasks,
    onSubmit,
    onCancel,
}: TimesheetEntryFormBaseProps): JSX.Element => {
    const [timesheetEntryFields, setTimesheetEntryFields] =
        useState<TimesheetEntryFields>(timesheetEntry || { timesheet, date })

    const resetForm = () => {
        setTimesheetEntryFields({
            ...timesheetEntryFields,
            date,
        })
    }

    const [quantityString, setQuantityString] = useState<string>(
        timesheetEntryFields.quantity?.toString() || ""
    )

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(error.toString())

    useEffect(
        () =>
            setTimesheetEntryFields({
                ...timesheetEntryFields,
                quantity: Number(quantityString),
            }),
        [quantityString]
    )

    useEffect(() => {
        resetForm()
    }, [date])

    const handleTaskChange = (event: React.FormEvent<HTMLSelectElement>) => {
        event.preventDefault()
        const id = event.currentTarget.value
        if (id) {
            const task = tasks.find(
                (taskIterator) => taskIterator.id === Number(id)
            )
            setTimesheetEntryFields({ ...timesheetEntryFields, task })
        }
    }

    const handleTimeCategoryChange = (
        event: React.FormEvent<HTMLSelectElement>
    ) => {
        event.preventDefault()
        const id = event.currentTarget.value
        if (id) {
            const timeCategory = timeCategories.find(
                (timeCategoryIterator) => timeCategoryIterator.id === Number(id)
            )
            setTimesheetEntryFields({ ...timesheetEntryFields, timeCategory })
        }
    }

    const handleSubmit = () => {
        try {
            const entry = validateTimesheetEntryFields(timesheetEntryFields)
            onSubmit(entry)
        } catch (error) {
            if (isError(error)) {
                errorHandler(error)
            }
        }
    }

    const taskSelectorKey = `entryEditorTaskSelector-${
        timesheetEntry?.id ? `edit-${timesheetEntry.id}` : `create`
    }`

    return (
        <>
            <Flex
                flexDirection="column"
                backgroundColor="white"
                border="1px solid"
                borderColor="gray.400"
                borderRadius="0.2rem"
                padding="1rem 1rem"
            >
                <FormControl
                    isRequired={timesheetEntryFieldMetadata.quantity.required}
                >
                    <FormLabel>Hours</FormLabel>
                    <Input
                        value={quantityString}
                        placeholder="Hours"
                        isRequired={true}
                        onChange={(event) =>
                            setQuantityString(event.target.value)
                        }
                        data-testid={"form-field-quantity"}
                        type="number"
                    />
                </FormControl>
                <FormControl
                    isRequired={
                        timesheetEntryFieldMetadata.description.required
                    }
                >
                    <FormLabel>Description</FormLabel>
                    <Input
                        value={timesheetEntryFields?.description || ""}
                        placeholder="Description"
                        onChange={(event) =>
                            setTimesheetEntryFields({
                                ...timesheetEntryFields,
                                description: event.target.value,
                            })
                        }
                        data-testid={"form-field-description"}
                    />
                </FormControl>
                <FormControl
                    isRequired={timesheetEntryFieldMetadata.task.required}
                >
                    <FormLabel>Task</FormLabel>
                    <Select
                        onChange={handleTaskChange}
                        placeholder="Select task"
                        marginRight="0.3rem"
                        value={timesheetEntryFields.task?.id}
                        data-testid={"form-field-task"}
                        key={taskSelectorKey}
                    >
                        {tasks.map((task) => (
                            <option key={`${task.id}`} value={task.id}>
                                {task.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl
                    isRequired={
                        timesheetEntryFieldMetadata.timeCategory.required
                    }
                >
                    <FormLabel>Time Category</FormLabel>
                    <Select
                        onChange={handleTimeCategoryChange}
                        placeholder="Select time category"
                        marginRight="0.3rem"
                        value={timesheetEntryFields.timeCategory?.id}
                        data-testid={"form-field-time-category"}
                    >
                        {timeCategories.map((timeCategory) => (
                            <option
                                key={`${timeCategory.id}`}
                                value={timeCategory.id}
                            >
                                {timeCategory.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>
                <div>
                    <FromButtons onSubmit={handleSubmit} onCancel={onCancel} />
                </div>
                {errorMessage && (
                    <>
                        <ErrorAlert />
                        <Box>{errorMessage}</Box>
                    </>
                )}
            </Flex>
        </>
    )
}

export const EditTimesheetEntryForm = (
    props: EditTimesheetEntryFormProps
): JSX.Element => {
    const { user } = useContext(UserContext)
    const { put } = useUpdate("timesheet-entry", user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(error.toString())

    const onSubmit = async (entry: TimesheetEntry) => {
        try {
            const updatedTimesheetEntry = await put(entry, errorHandler)
            return props.afterSubmit && props.afterSubmit(updatedTimesheetEntry)
        } catch (error) {
            errorHandler(error as Error)
            return null
        }
    }
    return (
        <>
            <TimesheetEntryForm
                {...props}
                timesheetEntry={props.entry}
                onSubmit={onSubmit}
            />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}

export const CreateTimesheetEntryForm = (
    props: CreateTimesheetEntryFormProps
): JSX.Element => {
    const { user } = useContext(UserContext)
    const asciiEmail = user.email?.replace("@", "%40")
    const start = "0000-01-01"
    const end = "9999-01-01"
    const refreshUrl = `/timesheet-entry?startDate=${start}&endDate=${end}&email=${asciiEmail}}`

    const { post } = useUpdate("timesheet-entries", user, refreshUrl)
    const { dates } = props

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(error.toString())

    const onSubmit = async (entry: TimesheetEntry) => {
        try {
            const newTimesheetEntries = dates.map((date) => ({
                ...entry,
                date: jsDateToShortISODate(date),
            }))
            const response = await post(newTimesheetEntries, errorHandler)
            return props.afterSubmit && props.afterSubmit(response)
        } catch (error) {
            errorHandler(error as Error)
            return null
        }
    }

    return (
        <>
            <TimesheetEntryForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    )
}
