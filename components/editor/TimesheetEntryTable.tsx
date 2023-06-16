/* eslint-disable react/no-unescaped-entities */
import { Project, Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { CloseIcon } from "@chakra-ui/icons"
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    Grid,
    GridItem,
    HStack,
    IconButton,
    Input,
    Select,
    Stack,
} from "@chakra-ui/react"
import _ from "lodash"
import { DateTime } from "luxon"
import React, { useEffect, useRef, useState } from "react"
import {
    useForm,
    useFieldArray,
    UseFormRegister,
    FieldValues,
    FieldErrors,
    UseFormWatch,
} from "react-hook-form"
import { SubmitButton } from "../form/utils"

type TimesheetEntryRow = {
    project: Project
    task: Task
    monday: number | ""
    tuesday: number | ""
    wednesday: number | ""
    thursday: number | ""
    friday: number | ""
    saturday: number | ""
    sunday: number | ""
    description?: string
}

const dayFields = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]

const convertTimesheetEntryRows = (
    rows: Partial<TimesheetEntryRow>[]
): TimesheetEntryRow[] => rows as TimesheetEntryRow[]

const timesheetEntriesToTimesheetEntryRows = (
    entries: TimesheetEntry[],
    monday: DateTime
) => {
    const entryRows = _.groupBy(entries, ({ timesheet, task, description }) => [
        timesheet.id,
        task.id,
        description,
    ])
    const rowArray = Object.keys(entryRows).map((key) => _.get(entryRows, key))
    const grouped = rowArray.map((arr) =>
        _.reduce(
            dayFields.map((day, j) => ({
                [day]: arr.find((entry) =>
                    yyyymmddToDateTime(entry.date).equals(
                        monday.plus({ days: j })
                    )
                ),
            })),
            (acc, item) => _.assign(acc, item),
            {}
        )
    )
    return grouped.map((g) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        monday: (g as any).monday?.quantity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tuesday: (g as any).tuesday?.quantity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wednesday: (g as any).wednesday?.quantity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        thursday: (g as any).thursday?.quantity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        friday: (g as any).friday?.quantity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        saturday: (g as any).saturday?.quantity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sunday: (g as any).sunday?.quantity,
        description: dayFields
            .map((d) => _.get(g, d)?.description)
            .filter((x) => !_.isEmpty(x))[0],
        timesheet: dayFields
            .map((d) => _.get(g, d)?.timesheet)
            .filter((x) => !_.isEmpty(x))[0],
        task: dayFields
            .map((d) => _.get(g, d)?.task)
            .filter((x) => !_.isEmpty(x))[0],
    }))
}

type MobileTimesheetEntryTableRowProps = MobileTimesheetEntryTableProps & {
    index: number
}

const MobileTimesheetEntryTableRow = ({
    timesheets,
    setSelectedRemove,
    days,
    register,
    errors,
    idAsTimesheet,
    idAsTask,
    tasksByProject,
    taskSelectDisabled,
    index,
    watch,
    getValues,
}: MobileTimesheetEntryTableRowProps) => {
    watch(`rows.${index}.timesheet`)
    const timesheetOrId = getValues(`rows.${index}.timesheet`)
    const timesheet = _.isUndefined(timesheetOrId?.id)
        ? idAsTimesheet(timesheetOrId)
        : timesheetOrId
    const tasks = tasksByProject(timesheet?.project?.id)

    return (
        <Card mb={8}>
            <CardHeader paddingBottom={0}>
                <Box textAlign="right">
                    <IconButton
                        variant="ghost"
                        colorScheme="gray"
                        aria-label="See menu"
                        icon={<CloseIcon />}
                        onClick={() => setSelectedRemove(index)}
                    />
                </Box>
            </CardHeader>
            <CardBody paddingTop={0}>
                <HStack spacing="24px" mb={8} mt={8}>
                    <Select
                        width="200px"
                        placeholder="Project"
                        {...register(`rows.${index}.timesheet`, {
                            required: "This is required.",
                            setValueAs: idAsTimesheet,
                        })}
                        isInvalid={
                            !_.isEmpty(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                _.get((errors as any)?.rows, index)?.timesheet
                            )
                        }
                    >
                        {timesheets.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.project.name}
                            </option>
                        ))}
                    </Select>
                    <Select
                        width="200px"
                        placeholder="Task"
                        {...register(`rows.${index}.task`, {
                            required: "This is required.",
                            setValueAs: idAsTask,
                        })}
                        isInvalid={
                            !_.isEmpty(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                _.get((errors as any)?.rows, index)?.task
                            )
                        }
                        isDisabled={taskSelectDisabled(index)}
                    >
                        {tasks.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </Select>
                    <Input
                        width="400px"
                        {...register(`rows.${index}.description`)}
                        placeholder="Description"
                    />
                </HStack>
                <Grid templateColumns="repeat(7, 4fr)" gap={2} height="100px">
                    {days.map((day, j) => (
                        <GridItem key={day} w="100%" h="10">
                            <Stack>
                                <Badge textAlign="center">{day}</Badge>
                                <Input
                                    p={0}
                                    textAlign="center"
                                    {...register(
                                        `rows.${index}.${dayFields[j]}`
                                    )}
                                />
                            </Stack>
                        </GridItem>
                    ))}
                </Grid>
            </CardBody>
        </Card>
    )
}

type MobileTimesheetEntryTableProps = {
    timesheets: Timesheet[]
    fields: Record<"id", string>[]
    setSelectedRemove: React.Dispatch<React.SetStateAction<number | undefined>>
    days: string[]
    register: UseFormRegister<FieldValues>
    errors: FieldErrors<FieldValues>
    idAsTimesheet: (id: string) => Timesheet | undefined
    idAsTask: (id: string) => Task | undefined
    tasksByProject: (id: string) => Task[]
    taskSelectDisabled: (index: number) => boolean
    watch: UseFormWatch<FieldValues>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValues: any
}

const MobileTimesheetEntryTable = ({
    fields,
    ...rest
}: MobileTimesheetEntryTableProps) => (
    <>
        {fields.map((field, index) => (
            <MobileTimesheetEntryTableRow
                key={field.id}
                {...rest}
                fields={fields}
                index={index}
            />
        ))}
    </>
)

type Option = {
    id?: number
    name: string
}

type OptionsProps = { options: Option[] }

const Options = ({ options }: OptionsProps) => (
    <>
        {options.map((o) => (
            <option key={o.id} value={o.id}>
                {o.name}
            </option>
        ))}
    </>
)

type DesktopTimesheetEntryTableRowProps = DesktopTimesheetEntryTableProps & {
    index: number
}

const DesktopTimesheetEntryTableRow = ({
    timesheets,
    setSelectedRemove,
    days,
    register,
    errors,
    idAsTimesheet,
    idAsTask,
    tasksByProject,
    taskSelectDisabled,
    watch,
    index,
    getValues,
}: DesktopTimesheetEntryTableRowProps) => {
    watch(`rows.${index}.timesheet`)
    const timesheetOrId = getValues(`rows.${index}.timesheet`)
    const timesheet = _.isUndefined(timesheetOrId?.id)
        ? idAsTimesheet(timesheetOrId)
        : timesheetOrId
    const tasks = tasksByProject(timesheet?.project?.id)

    return (
        <Box mb={2}>
            <Grid templateColumns="repeat(11, 4fr)" gap={2}>
                <GridItem w="100%" h="10">
                    <Select
                        width="100px"
                        placeholder="Project"
                        {...register(`rows.${index}.timesheet`, {
                            required: "This is required.",
                            setValueAs: idAsTimesheet,
                        })}
                        isInvalid={
                            !_.isEmpty(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                _.get((errors as any)?.rows, index)?.timesheet
                            )
                        }
                    >
                        {timesheets.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.project.name}
                            </option>
                        ))}
                    </Select>
                </GridItem>
                <GridItem w="100%" h="10">
                    <Select
                        width="100px"
                        placeholder="Task"
                        {...register(`rows.${index}.task`, {
                            required: "This is required.",
                            setValueAs: idAsTask,
                        })}
                        isInvalid={
                            !_.isEmpty(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                _.get((errors as any)?.rows, index)?.task
                            )
                        }
                        isDisabled={taskSelectDisabled(index)}
                    >
                        <Options options={tasks} />
                    </Select>
                </GridItem>
                {days.map((day, j) => (
                    <GridItem key={day} w="100%" h="10">
                        <Input
                            p={0}
                            textAlign="center"
                            {...register(`rows.${index}.${dayFields[j]}`)}
                        />
                    </GridItem>
                ))}
                <GridItem w="100%" h="10" width="200px">
                    <Input
                        {...register(`rows.${index}.description`)}
                        placeholder="Description"
                    />
                </GridItem>
                <GridItem w="100%" h="10">
                    <IconButton
                        variant="ghost"
                        colorScheme="gray"
                        aria-label="See menu"
                        icon={<CloseIcon />}
                        onClick={() => setSelectedRemove(index)}
                    />
                </GridItem>
            </Grid>
        </Box>
    )
}

type DesktopTimesheetEntryTableProps = {
    timesheets: Timesheet[]
    fields: Record<"id", string>[]
    setSelectedRemove: React.Dispatch<React.SetStateAction<number | undefined>>
    days: string[]
    register: UseFormRegister<FieldValues>
    errors: FieldErrors<FieldValues>
    idAsTimesheet: (id: string) => Timesheet | undefined
    idAsTask: (id: string) => Task | undefined
    tasksByProject: (id: string) => Task[]
    taskSelectDisabled: (index: number) => boolean
    watch: UseFormWatch<FieldValues>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValues: any
    monday: DateTime
}

const DesktopTimesheetEntryTable = ({
    fields,
    ...rest
}: DesktopTimesheetEntryTableProps) => (
    <Box height="200px" overflowY="scroll">
        {fields.map((field, index) => (
            <DesktopTimesheetEntryTableRow
                key={field.id}
                {...rest}
                fields={fields}
                index={index}
            />
        ))}
    </Box>
)

const getDayAndMonth = (datetime: DateTime) =>
    `${datetime.day}.${datetime.month}.`
const yyyymmddToDateTime = (yyyymmdd: string) =>
    DateTime.fromFormat(yyyymmdd, "yyyy-MM-dd")

type TimesheetEntryTableProps = {
    timesheets: Timesheet[]
    tasks: Task[]
    isLarge: boolean
    selectedDate: Date | undefined
    entries: TimesheetEntry[]
}

const TimesheetEntryTable = ({
    isLarge,
    timesheets,
    tasks,
    selectedDate,
    entries,
}: TimesheetEntryTableProps) => {
    const {
        control,
        register,
        handleSubmit,
        getValues,
        reset,
        watch,
        formState: { errors },
    } = useForm({ mode: "onBlur" })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows",
        shouldUnregister: true,
    })
    const getMonday = (date: Date) => DateTime.fromJSDate(date).startOf("week")

    const [monday, setMonday] = useState(
        (selectedDate && getMonday(selectedDate)) || getMonday(new Date())
    )
    const sunday = monday.endOf("week")

    const filteredEntries = entries.filter(
        (entry) =>
            monday <= yyyymmddToDateTime(entry.date) &&
            sunday >= yyyymmddToDateTime(entry.date)
    )

    const entryRows = timesheetEntriesToTimesheetEntryRows(
        filteredEntries,
        monday
    )

    useEffect(() => {
        reset()
        for (const row of entryRows) {
            append({ ...row, timesheet: row.timesheet.id, task: row.task.id })
        }
    }, [monday])

    useEffect(() => {
        if (selectedDate) {
            setMonday(getMonday(selectedDate))
        }
    }, [selectedDate])

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ].map((day) => (isLarge ? day : day.slice(0, 3)))

    const [selectedRemove, setSelectedRemove] = useState<number>()
    const cancelRef = useRef<HTMLButtonElement>(null)

    const submit = handleSubmit((vals) => {
        const { rows } = vals
        // eslint-disable-next-line no-console
        console.log(convertTimesheetEntryRows(rows))
    })

    const empty = {
        timesheet: undefined,
        task: undefined,
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: "",
        description: "",
    }

    const idAsTimesheet = (id: string) =>
        timesheets.find((p) => p.id === Number(id))
    const idAsTask = (id: string) => tasks.find((t) => t.id === Number(id))
    const taskSelectDisabled = (index: number) =>
        _.isUndefined(getValues(`rows.${index}.timesheet`))

    const tasksByProject = (id: string | undefined) =>
        tasks.filter((t) => t.project.id === Number(id))

    const [displayAlert, setDisplayAlert] = useState(false)

    useEffect(() => {
        const deletingEmptyRow =
            !_.isUndefined(selectedRemove) &&
            !getValues(
                Object.keys(empty).map((key) => `rows.${selectedRemove}.${key}`)
            )
                .map((x) => _.isEmpty(x))
                .includes(false)
        if (deletingEmptyRow) {
            remove(selectedRemove)
            setSelectedRemove(undefined)
        } else if (!_.isUndefined(selectedRemove)) {
            setDisplayAlert(true)
        } else {
            setDisplayAlert(false)
        }
    }, [selectedRemove])

    return (
        <>
            {displayAlert && (
                <AlertDialog
                    isOpen={!_.isUndefined(selectedRemove)}
                    onClose={() => setSelectedRemove(undefined)}
                    leastDestructiveRef={cancelRef}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Delete timesheet row
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure? You can't undo this action
                                afterwards.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button
                                    onClick={() => setSelectedRemove(undefined)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    colorScheme="red"
                                    onClick={() => {
                                        remove(selectedRemove)
                                        setSelectedRemove(undefined)
                                    }}
                                    ml={3}
                                >
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            )}
            <form onSubmit={submit}>
                <HStack>
                    <Button
                        onClick={() => append(empty)}
                        backgroundColor="green.300"
                        color="white"
                        mb={8}
                        mt={8}
                    >
                        New row
                    </Button>
                    <Box width="80%">
                        <Center>
                            Entries between {getDayAndMonth(monday)} and{" "}
                            {getDayAndMonth(sunday)}
                        </Center>
                    </Box>
                </HStack>
                {isLarge ? (
                    <DesktopTimesheetEntryTable
                        timesheets={timesheets}
                        tasksByProject={tasksByProject}
                        fields={fields}
                        setSelectedRemove={setSelectedRemove}
                        days={days}
                        register={register}
                        errors={errors}
                        idAsTimesheet={idAsTimesheet}
                        idAsTask={idAsTask}
                        taskSelectDisabled={taskSelectDisabled}
                        watch={watch}
                        monday={monday}
                        getValues={getValues}
                    />
                ) : (
                    <MobileTimesheetEntryTable
                        timesheets={timesheets}
                        tasksByProject={tasksByProject}
                        fields={fields}
                        setSelectedRemove={setSelectedRemove}
                        days={days}
                        register={register}
                        errors={errors}
                        idAsTimesheet={idAsTimesheet}
                        idAsTask={idAsTask}
                        taskSelectDisabled={taskSelectDisabled}
                        watch={watch}
                        getValues={getValues}
                    />
                )}
                <Box textAlign="right">
                    <SubmitButton disabled={false} />
                </Box>
            </form>
        </>
    )
}

export default TimesheetEntryTable
