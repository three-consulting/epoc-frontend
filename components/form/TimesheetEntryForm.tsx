import { useUpdateTimesheetEntries } from "@/lib/hooks/useTimesheetEntries"
import {
    Task,
    TimeCategory,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import { Box, Flex, Input, Select } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import ErrorAlert from "../common/ErrorAlert"
import { FromButtons } from "../common/FormFields"

type TimesheetEntryFormBaseProps = FormBase<TimesheetEntry> & {
    entryOrNull?: TimesheetEntry
    timesheet: Timesheet
    date: string
    timeCategories: TimeCategory[]
    tasks: Task[]
    onSubmit: (entry: TimesheetEntry) => void
}

type CreateTimesheetEntryFormProps = FormBase<TimesheetEntry> & {
    timesheet: Timesheet
    date: string
    timeCategories: TimeCategory[]
    tasks: Task[]
}

type EditTimesheetEntryFormProps = FormBase<TimesheetEntry> & {
    entry: TimesheetEntry
    timesheet: Timesheet
    date: string
    timeCategories: TimeCategory[]
    tasks: Task[]
}

type TimesheetEntryFields = Partial<TimesheetEntry> & {
    timesheet: Timesheet
    date: string
}

const validateTimesheetEntryFields = (
    fields: TimesheetEntryFields
): TimesheetEntry => {
    const { timesheet, quantity, timeCategory, date, task } = fields
    if (timesheet && quantity && date && timeCategory && task) {
        return { ...fields, timesheet, quantity, date, timeCategory, task }
    }
    throw Error("Invalid timesheet entry form: missing required fields")
}

function TimesheetEntryForm({
    entryOrNull,
    timesheet,
    date,
    timeCategories,
    tasks,
    onSubmit,
    onCancel,
}: TimesheetEntryFormBaseProps): JSX.Element {
    const [timesheetEntryFields, setTimesheetEntryFields] =
        useState<TimesheetEntryFields>(entryOrNull || { timesheet, date })

    const resetForm = () => {
        setTimesheetEntryFields({
            ...timesheetEntryFields,
            date,
        })
    }

    const [quantityString, setQuantityString] = useState<string>(
        timesheetEntryFields.quantity?.toString() || ""
    )

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
        const entry = validateTimesheetEntryFields(timesheetEntryFields)
        onSubmit(entry)
    }

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
                <Input
                    value={quantityString}
                    placeholder="Hours"
                    onChange={(event) => setQuantityString(event.target.value)}
                    data-testid={"form-field-quantity"}
                />
                <Select
                    onChange={handleTaskChange}
                    placeholder="Select task"
                    marginRight="0.3rem"
                    value={timesheetEntryFields.task?.id}
                    data-testid={"form-field-task"}
                >
                    {tasks.map((task, idx) => (
                        <option key={idx} value={task.id}>
                            {task.name}
                        </option>
                    ))}
                </Select>
                <Select
                    onChange={handleTimeCategoryChange}
                    placeholder="Select time category"
                    marginRight="0.3rem"
                    value={timesheetEntryFields.timeCategory?.id}
                    data-testid={"form-field-time-category"}
                >
                    {timeCategories.map((timeCategory, idx) => (
                        <option key={idx} value={timeCategory.id}>
                            {timeCategory.name}
                        </option>
                    ))}
                </Select>
                <div>
                    <FromButtons onSubmit={handleSubmit} onCancel={onCancel} />
                </div>
            </Flex>
        </>
    )
}

export function EditTimesheetEntryForm(
    props: EditTimesheetEntryFormProps
): JSX.Element {
    const { putTimesheetEntry } = useUpdateTimesheetEntries()

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (entry: TimesheetEntry) => {
        try {
            const updatedTimesheetEntry = await putTimesheetEntry(
                entry,
                errorHandler
            )
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
                entryOrNull={props.entry}
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

export function CreateTimesheetEntryForm(
    props: CreateTimesheetEntryFormProps
): JSX.Element {
    const { postTimesheetEntry } = useUpdateTimesheetEntries()

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorHandler = (error: Error) => setErrorMessage(`${error}`)

    const onSubmit = async (entry: TimesheetEntry) => {
        try {
            const newTimesheetEntry = await postTimesheetEntry(
                entry,
                errorHandler
            )
            return props.afterSubmit && props.afterSubmit(newTimesheetEntry)
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