import { Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { FormBase } from "@/lib/types/forms"
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
} from "@chakra-ui/react"
import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useRef,
    useState,
} from "react"
import ErrorAlert from "../common/ErrorAlert"
import { FromButtons } from "../common/FormFields"
import { timesheetEntryFieldMetadata } from "@/lib/types/typeMetadata"
import { datesRange, jsDateToShortISODate } from "@/lib/utils/date"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import {
    useUpdateTimesheetEntries,
    useUpdateTimesheetEntry,
} from "@/lib/hooks/useUpdate"
import { isError } from "lodash"

type TSetState<T> = Dispatch<SetStateAction<T>>
type TimesheetEntryFields = Partial<TimesheetEntry>

interface TimesheetEntryFormBaseProps extends FormBase<TimesheetEntry> {
    timesheetEntry?: TimesheetEntry
    tasks: Task[]
    timesheetEntryFields: TimesheetEntryFields
    setTimesheetEntryFields: TSetState<TimesheetEntryFields>
    buttons: JSX.Element
}

interface CreateTimesheetEntryFormProps
    extends FormBase<TimesheetEntry | TimesheetEntry[]> {
    projectId: number
    date: string
    dates: Date[]
    tasks: Task[]
    timesheet: Timesheet
    setTimesheetEntries: TSetState<TimesheetEntry[]>
}

interface EditTimesheetEntryFormProps extends FormBase<TimesheetEntry> {
    id: number
    timesheetEntry: TimesheetEntry
    projectId: number
    date: string
    tasks: Task[]
    timesheet: Timesheet
    setTimesheetEntries: TSetState<TimesheetEntry[]>
}

export const validateTimesheetEntryFields = (
    fields: TimesheetEntryFields
): TimesheetEntry => {
    const { timesheet, quantity, date, task } = fields
    if (!timesheet) {
        throw Error(
            "Invalid timesheet entry form: missing required timesheet field"
        )
    } else if (quantity === undefined || quantity === null) {
        throw Error(
            "Invalid timesheet entry form: missing required quantity field"
        )
    } else if (!date) {
        throw Error("Invalid timesheet entry form: missing required date field")
    } else if (!task) {
        throw Error("Invalid timesheet entry form: missing required task field")
    }
    return { ...fields, timesheet, quantity, date, task }
}

const TimesheetEntryForm = ({
    timesheetEntry,
    tasks,
    timesheetEntryFields,
    setTimesheetEntryFields,
    buttons,
}: TimesheetEntryFormBaseProps): JSX.Element => {
    const quantityRef = useRef<string>(
        timesheetEntryFields.quantity?.toString() || ""
    )

    const handleQuantityChange = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault()
        quantityRef.current = event.currentTarget.value
        const quantity = Number(quantityRef.current)

        if (quantityRef.current === "") {
            setTimesheetEntryFields({
                ...timesheetEntryFields,
                quantity: undefined,
            })
        } else if (!isNaN(quantity)) {
            setTimesheetEntryFields({
                ...timesheetEntryFields,
                quantity,
            })
        }
    }

    const handleTaskChange = (event: React.FormEvent<HTMLSelectElement>) => {
        event.preventDefault()
        const id = event.currentTarget.value
        if (id) {
            const task = tasks.find(
                (taskIterator) => taskIterator.id === Number(id)
            )
            setTimesheetEntryFields((fields) => ({ ...fields, task }))
        }
    }

    const taskSelectorKey = `entryEditorTaskSelector-${
        timesheetEntry?.id ? `edit-${timesheetEntry.id}` : `create`
    }`

    return (
        <>
            <Flex flexDirection="column" padding="1rem">
                <FormControl
                    isRequired={timesheetEntryFieldMetadata.quantity.required}
                >
                    <FormLabel>Hours</FormLabel>
                    <Input
                        value={quantityRef.current}
                        placeholder="Hours"
                        isRequired={true}
                        onChange={handleQuantityChange}
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
                            setTimesheetEntryFields &&
                            setTimesheetEntryFields((fields) => ({
                                ...fields,
                                description: event.target.value,
                            }))
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
                {buttons}
            </Flex>
        </>
    )
}

export const EditTimesheetEntryForm = ({
    id,
    onCancel,
    timesheetEntry,
    setTimesheetEntries,
    afterSubmit,
    ...props
}: EditTimesheetEntryFormProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { put } = useUpdateTimesheetEntry(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const [timesheetEntryFields, setTimesheetEntryFields] =
        useState<TimesheetEntryFields>(timesheetEntry)

    const errorHandler = (error: Error) => setErrorMessage(error.toString())

    const handlePut = async () => {
        if (timesheetEntryFields) {
            try {
                const entry = validateTimesheetEntryFields(timesheetEntryFields)
                const updatedTimesheetEntry = await put(entry, errorHandler)
                setTimesheetEntries((entries) => {
                    const indx = entries.findIndex((ent) => ent.id === id)
                    entries[indx] = entry
                    return entries
                })

                if (afterSubmit) {
                    afterSubmit(updatedTimesheetEntry)
                }
            } catch (err) {
                if (isError(err)) {
                    errorHandler(err)
                }
            }
        }
    }

    const Buttons = (
        <FromButtons onSubmit={() => handlePut()} onCancel={onCancel} />
    )

    return (
        <>
            <TimesheetEntryForm
                {...props}
                timesheetEntryFields={timesheetEntryFields}
                setTimesheetEntryFields={setTimesheetEntryFields}
                buttons={Buttons}
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

export const CreateTimesheetEntryForm = ({
    onCancel,
    dates,
    timesheet,
    setTimesheetEntries,
    afterSubmit,
    ...props
}: CreateTimesheetEntryFormProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { post } = useUpdateTimesheetEntries(user)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const [timesheetEntryFields, setTimesheetEntryFields] =
        useState<TimesheetEntryFields>({
            date: jsDateToShortISODate(datesRange(dates)[0]),
            timesheet,
        })

    const errorHandler = (error: Error) => setErrorMessage(error.toString())

    const handlePost = async () => {
        if (timesheetEntryFields) {
            try {
                const entry = validateTimesheetEntryFields(timesheetEntryFields)
                const newTimesheetEntries = dates.map(
                    (entryDate: Date | null) => ({
                        ...entry,
                        date: entryDate
                            ? jsDateToShortISODate(entryDate)
                            : entry.date,
                    })
                )
                const response = await post(newTimesheetEntries, errorHandler)

                if (afterSubmit) {
                    afterSubmit(response)
                }

                if (response.isSuccess && response.data) {
                    setTimesheetEntries((entries) =>
                        entries.concat(response.data)
                    )
                }
            } catch (err) {
                if (isError(err)) {
                    errorHandler(err)
                }
            }
        }
    }

    const buttons = (
        <FromButtons onSubmit={() => handlePost()} onCancel={onCancel} />
    )

    return (
        <>
            <TimesheetEntryForm
                {...props}
                timesheetEntryFields={timesheetEntryFields}
                setTimesheetEntryFields={setTimesheetEntryFields}
                buttons={buttons}
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
