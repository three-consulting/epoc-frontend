/* eslint-disable react/no-unescaped-entities */
import { dateIsHoliday, Holiday } from "@/lib/hooks/useHoliday"
import { useUpdateTimesheetEntry } from "@/lib/hooks/useUpdate"
import { Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { getDayAndMonth, yyyymmddToDateTime } from "@/lib/utils/common"
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@chakra-ui/icons"
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
import { Options, SubmitButton, useSuccessErrorToast } from "./form/utils"

type TimesheetEntryRow = {
    timesheet: Timesheet
    task: Task
    monday: number | ""
    tuesday: number | ""
    wednesday: number | ""
    thursday: number | ""
    friday: number | ""
    saturday: number | ""
    sunday: number | ""
    ids: (number | undefined)[]
    days: DateTime[]
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

const convertTimesheetEntryRow = ({
    timesheet,
    task,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    ids,
    days,
    ...rest
}: Partial<TimesheetEntryRow>): TimesheetEntryRow => {
    if (
        !_.isUndefined(timesheet) &&
        !_.isUndefined(task) &&
        !_.isUndefined(monday) &&
        !_.isUndefined(tuesday) &&
        !_.isUndefined(wednesday) &&
        !_.isUndefined(thursday) &&
        !_.isUndefined(friday) &&
        !_.isUndefined(saturday) &&
        !_.isUndefined(sunday) &&
        !_.isUndefined(ids) &&
        !_.isUndefined(days)
    ) {
        return {
            timesheet,
            task,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
            ids,
            days,
            ...rest,
        }
    }
    throw Error("Form error, missing required fields")
}

const timesheetEntryRowToTimesheetEntries = (
    row: TimesheetEntryRow
): TimesheetEntry[] =>
    dayFields.map((day, index) => ({
        id: row.ids[index],
        quantity: (Number(_.get(row, day)) || 0) as number,
        timesheet: row.timesheet,
        task: row.task,
        description: row.description,
        date: row.days[index].toISODate() || "",
        flex: 0,
    }))

const quantityByDate = (
    row: (TimesheetEntry | undefined)[],
    plusDays: number,
    monday: DateTime
) =>
    row.find(
        (e) =>
            e &&
            yyyymmddToDateTime(e.date).equals(monday.plus({ days: plusDays }))
    )?.quantity || ""

const timesheetEntriesToTimesheetEntryRows = (
    entries: TimesheetEntry[],
    monday: DateTime
): TimesheetEntryRow[] =>
    _.reverse(
        _.sortBy(
            _.values(
                _.groupBy(entries, (e) => [
                    e.timesheet.id,
                    e.task.id,
                    e.description,
                ])
            )
                .map((es) => _.values(_.groupBy(es, "date")))
                .flatMap((x) => _.zip(...x))
                .map((row) => ({
                    task: row[0]?.task as Task,
                    timesheet: row[0]?.timesheet as Timesheet,
                    description: row[0]?.description || "",
                    monday: quantityByDate(row, 0, monday),
                    tuesday: quantityByDate(row, 1, monday),
                    wednesday: quantityByDate(row, 2, monday),
                    thursday: quantityByDate(row, 3, monday),
                    friday: quantityByDate(row, 4, monday),
                    saturday: quantityByDate(row, 5, monday),
                    sunday: quantityByDate(row, 6, monday),
                    ids: dayFields.map(
                        (_day, i) =>
                            row.find(
                                (e) =>
                                    e &&
                                    yyyymmddToDateTime(e.date).equals(
                                        monday.plus({ days: i })
                                    )
                            )?.id
                    ),
                    days: dayFields.map((_day, i) => monday.plus({ days: i })),
                })),
            ({ timesheet, task, description }) => [
                timesheet.project.name,
                task.name,
                description,
            ]
        )
    )

type TimesheetEntryTableProps = {
    timesheets: Timesheet[]
    fields: Record<"id", string>[]
    setSelectedRemove: React.Dispatch<React.SetStateAction<number | undefined>>
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
    holidays: Holiday[]
}

type TimesheetEntryTableRowProps = TimesheetEntryTableProps & {
    index: number
}

const MobileTimesheetEntryTableRow = ({
    timesheets,
    setSelectedRemove,
    register,
    errors,
    idAsTimesheet,
    idAsTask,
    tasksByProject,
    taskSelectDisabled,
    index,
    watch,
    getValues,
    monday,
    holidays,
}: TimesheetEntryTableRowProps) => {
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
                        <Options options={tasks} />
                    </Select>
                </HStack>
                <Input
                    {...register(`rows.${index}.description`)}
                    placeholder="Description"
                    mb={8}
                />
                <Grid templateColumns="repeat(7, 4fr)" gap={2} height="100px">
                    {dayFields.map((day, j) => {
                        const datetime = monday.plus({ days: j })
                        const isHoliday = dateIsHoliday(datetime, holidays)

                        return (
                            <GridItem key={day} w="100%" h="10">
                                <Stack>
                                    <Badge
                                        textAlign="center"
                                        color={isHoliday ? "red" : ""}
                                    >
                                        {getDayAndMonth(datetime)}
                                    </Badge>
                                    <Input
                                        p={0}
                                        textAlign="center"
                                        {...register(
                                            `rows.${index}.${dayFields[j]}`
                                        )}
                                        background={isHoliday ? "#ffd9d9" : ""}
                                    />
                                </Stack>
                            </GridItem>
                        )
                    })}
                </Grid>
            </CardBody>
        </Card>
    )
}

const MobileTimesheetEntryTable = ({
    fields,
    ...rest
}: TimesheetEntryTableProps) => (
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

const DesktopTimesheetEntryTableRow = ({
    timesheets,
    setSelectedRemove,
    register,
    errors,
    idAsTimesheet,
    idAsTask,
    tasksByProject,
    taskSelectDisabled,
    watch,
    index,
    getValues,
    monday,
    holidays,
}: TimesheetEntryTableRowProps) => {
    watch(`rows.${index}.timesheet`)
    const timesheetOrId = getValues(`rows.${index}.timesheet`)
    const timesheet = _.isUndefined(timesheetOrId?.id)
        ? idAsTimesheet(timesheetOrId)
        : timesheetOrId
    const tasks = tasksByProject(timesheet?.project?.id)

    return (
        <>
            <GridItem w="100%" h="10">
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
            </GridItem>
            <GridItem w="100%" h="10">
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
                    <Options options={tasks} />
                </Select>
            </GridItem>
            {dayFields.map((day, j) => {
                const datetime = monday.plus({ days: j })
                const isHoliday = dateIsHoliday(datetime, holidays)

                return (
                    <GridItem key={day} w="100%" h="10">
                        <Input
                            p={0}
                            textAlign="center"
                            {...register(`rows.${index}.${dayFields[j]}`)}
                            background={isHoliday ? "#ffd9d9" : ""}
                        />
                    </GridItem>
                )
            })}
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
        </>
    )
}

const DesktopTimesheetEntryTable = ({
    fields,
    monday,
    holidays,
    ...rest
}: TimesheetEntryTableProps) => (
    <Box height="200px" overflowY="scroll">
        <Grid templateColumns="repeat(11, 1fr)" gap={1}>
            <GridItem />
            <GridItem />
            {fields.length > 0 &&
                dayFields.map((_day, i) => {
                    const datetime = monday.plus({ days: i })
                    const color = dateIsHoliday(datetime, holidays) ? "red" : ""
                    return (
                        <GridItem key={i}>
                            <Center>
                                <Badge color={color}>
                                    {getDayAndMonth(monday.plus({ days: i }))}
                                </Badge>
                            </Center>
                        </GridItem>
                    )
                })}
            <GridItem />
            <GridItem />
            {fields.map((field, index) => (
                <DesktopTimesheetEntryTableRow
                    key={field.id}
                    {...rest}
                    holidays={holidays}
                    monday={monday}
                    fields={fields}
                    index={index}
                />
            ))}
        </Grid>
    </Box>
)

type TimesheetEntryGridProps = {
    timesheets: Timesheet[]
    tasks: Task[]
    isLarge: boolean
    selectedDate: DateTime
    setSelectedDate: React.Dispatch<React.SetStateAction<DateTime>>
    entries: TimesheetEntry[]
    holidays: Holiday[]
}

const TimesheetEntryGrid = ({
    isLarge,
    timesheets,
    tasks,
    selectedDate,
    setSelectedDate,
    entries,
    holidays,
}: TimesheetEntryGridProps) => {
    const [monday, setMonday] = useState(selectedDate.startOf("week"))
    const sunday = monday.endOf("week")
    const [selectedRemove, setSelectedRemove] = useState<number>()
    const [displayAlert, setDisplayAlert] = useState(false)
    const { post, put, delete: del } = useUpdateTimesheetEntry()
    const cancelRef = useRef<HTMLButtonElement>(null)
    const { successToast, errorToast } = useSuccessErrorToast(
        "Entries saved.",
        "Error saving entries."
    )
    const entryRows = timesheetEntriesToTimesheetEntryRows(
        entries.filter(
            (entry) =>
                monday <= yyyymmddToDateTime(entry.date) &&
                sunday >= yyyymmddToDateTime(entry.date)
        ),
        monday
    )
    const idAsTimesheet = (id: string) =>
        timesheets.find((p) => p.id === Number(id))
    const idAsTask = (id: string) => tasks.find((t) => t.id === Number(id))
    const taskSelectDisabled = (index: number) =>
        _.isUndefined(getValues(`rows.${index}.timesheet`))
    const tasksByProject = (id: string | undefined) =>
        tasks.filter((t) => t.project.id === Number(id))
    const deleteEntriesByRow = (i: number) => {
        const row = getValues().rows[i] as TimesheetEntryRow
        return del(
            row?.ids.filter((id): id is number => !_.isUndefined(id)),
            () => undefined
        )
    }
    const prevWeek = () => setSelectedDate(monday.minus({ days: 7 }))
    const nextWeek = () => setSelectedDate(monday.plus({ days: 7 }))

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
        ids: [],
        days: dayFields.map((_day, i) => monday.plus({ day: i })),
    }

    useEffect(() => {
        getValues()?.rows?.forEach(() => remove(0))
        reset()
        for (const row of entryRows) {
            append({ ...row, timesheet: row.timesheet.id, task: row.task.id })
        }
    }, [monday])

    useEffect(() => {
        if (selectedDate) {
            setMonday(selectedDate.startOf("week"))
        }
    }, [selectedDate])

    useEffect(() => {
        const deletingEmptyRow =
            !_.isUndefined(selectedRemove) &&
            !getValues(
                Object.keys(empty)
                    .filter((key) => key !== "days")
                    .map((key) => `rows.${selectedRemove}.${key}`)
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
    const [isLoading, setIsLoading] = useState(false)

    const submit = handleSubmit(async (vals) => {
        if (isLoading) {
            return
        }
        const { rows } = vals
        const updatedEntries = ((rows as TimesheetEntryRow[]) || [])
            .map(convertTimesheetEntryRow)
            .flatMap(timesheetEntryRowToTimesheetEntries)
            .filter(({ id, quantity }) => !_.isUndefined(id) || quantity > 0)

        if (_.isEmpty(updatedEntries)) {
            return
        }

        setIsLoading(true)
        const postResponse = await post(
            updatedEntries.filter(
                ({ id, quantity }) => _.isUndefined(id) && quantity > 0
            ),
            () => undefined
        )
        const putResponse = await put(
            updatedEntries.filter(
                ({ id, quantity }) => !_.isUndefined(id) && quantity > 0
            ),
            () => undefined
        )
        await del(
            updatedEntries
                .filter(
                    ({ id, quantity }) => !_.isUndefined(id) && quantity === 0
                )
                .map(({ id }) => id as number),
            () => undefined
        )
        setIsLoading(false)
        const sucess = postResponse.isSuccess && putResponse.isSuccess

        if (sucess) {
            getValues()?.rows?.forEach(() => remove(0))
            const responseRows = timesheetEntriesToTimesheetEntryRows(
                postResponse.data.concat(putResponse.data),
                monday
            )
            for (const row of responseRows) {
                append({
                    ...row,
                    timesheet: row.timesheet.id,
                    task: row.task.id,
                })
            }
            successToast()
        } else {
            errorToast()
        }
    })

    const buttonMobileStyles = {
        position: "fixed",
        bottom: "0",
        left: "0",
        paddingTop: "20px",
        background: "white",
        width: "100vw",
        paddingRight: "20px",
        paddingBottom: "20px",
    }

    const entryTableProps = {
        timesheets,
        tasksByProject,
        fields,
        setSelectedRemove,
        register,
        errors,
        idAsTimesheet,
        idAsTask,
        taskSelectDisabled,
        watch,
        getValues,
        monday,
        holidays,
    }

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
                                    onClick={async () => {
                                        if (!_.isUndefined(selectedRemove)) {
                                            await deleteEntriesByRow(
                                                selectedRemove
                                            )
                                            remove(selectedRemove)
                                            setSelectedRemove(undefined)
                                        }
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
                    <DesktopTimesheetEntryTable {...entryTableProps} />
                ) : (
                    <MobileTimesheetEntryTable {...entryTableProps} />
                )}
                <Box
                    display="flex"
                    mt={8}
                    __css={isLarge ? {} : buttonMobileStyles}
                >
                    <Box margin={"0 auto"}>
                        <HStack spacing="64px">
                            <IconButton
                                aria-label="previous week"
                                icon={<ArrowLeftIcon />}
                                onClick={prevWeek}
                            />
                            <IconButton
                                aria-label="next week"
                                icon={<ArrowRightIcon />}
                                onClick={nextWeek}
                            />
                        </HStack>
                    </Box>
                    <Box>
                        <SubmitButton isLoading={isLoading} disabled={false} />
                    </Box>
                </Box>
            </form>
        </>
    )
}

export default TimesheetEntryGrid
