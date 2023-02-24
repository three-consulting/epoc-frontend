import { useUpdateTimesheetEntries } from "@/lib/hooks/useUpdate"
import { Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { isDate, round, sum } from "lodash"
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    Link,
    Select,
    SimpleGrid,
    Switch,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tooltip,
    Tr,
    useOutsideClick,
} from "@chakra-ui/react"
import React, { Dispatch, SetStateAction, useRef, useState } from "react"
import Calendar, {
    CalendarTileProperties,
    ViewCallbackProperties,
} from "react-calendar"
import {
    CreateTimesheetEntryForm,
    EditTimesheetEntryForm,
} from "../form/TimesheetEntryForm"
import { DateTime } from "luxon"
import { DeleteHookFunction } from "@/lib/types/hooks"
import {
    datesRange,
    datesValue,
    jsDateToShortISODate,
    toLocalDisplayDate,
} from "@/lib/utils/date"
import ImportFromCSVModal from "../modal/ImportFromCSVModal"
import useHoliday from "@/lib/hooks/useHoliday"
import Header, { TableHeader } from "../common/Header"
import { BsCaretDown, BsCaretLeft, BsSunglasses, BsTrash } from "react-icons/bs"
import { User } from "firebase/auth"

type TSetState<T> = Dispatch<SetStateAction<T>>

interface TimesheetEntryEditorProps {
    entries: TimesheetEntry[]
    timesheets: Timesheet[]
    tasks: Task[]
    user: User
}

interface TimesheetEntryRowProps {
    entry: TimesheetEntry
    deleteTimesheetEntry: DeleteHookFunction
    date: string
    tasks: Task[]
    setTimesheetEntries: TSetState<TimesheetEntry[]>
}

interface DayEditorProps {
    timesheets: Timesheet[]
    dateRange: [Date] | [Date, Date]
    entries: TimesheetEntry[]
    tasks: Task[]
    setTimesheetEntries: TSetState<TimesheetEntry[]>
    user: User
}

const taskByProject = (tasks: Task[], projectId: number) =>
    tasks.filter((task) => task.project.id === projectId)

const TimesheetEntryRow = ({
    entry,
    deleteTimesheetEntry,
    date,
    tasks,
    setTimesheetEntries,
}: TimesheetEntryRowProps): JSX.Element => {
    const { id } = entry
    const projectId = entry.timesheet.project.id
    const [edit, setEdit] = useState<boolean>(false)

    return (
        <>
            {projectId && id && (
                <>
                    <Td paddingX="1.5rem">
                        {!edit && (
                            <Link
                                onClick={() => setEdit(!edit)}
                                style={{
                                    fontWeight: "bold",
                                }}
                            >
                                {round(entry.quantity, 2)} Hours on{" "}
                                {entry.timesheet.project.name}
                            </Link>
                        )}
                        {edit && (
                            <Box border="#6f6f6f solid 1px">
                                <EditTimesheetEntryForm
                                    id={id}
                                    timesheetEntry={entry}
                                    timesheet={entry.timesheet}
                                    projectId={projectId}
                                    date={date}
                                    onCancel={() => setEdit(!edit)}
                                    afterSubmit={() => setEdit(!edit)}
                                    tasks={tasks}
                                    setTimesheetEntries={setTimesheetEntries}
                                />
                            </Box>
                        )}
                    </Td>
                    <Td display="flex" justifyContent="end">
                        <Link
                            onClick={() => {
                                setTimesheetEntries((entries) => {
                                    const indx = entries.findIndex(
                                        (ent) => ent.id === id
                                    )
                                    if (indx !== -1) {
                                        entries.splice(indx, 1)
                                    }
                                    return entries
                                })
                                deleteTimesheetEntry(id, () => undefined)
                            }}
                        >
                            <Icon as={BsTrash} boxSize="1.5rem" />
                        </Link>
                    </Td>
                </>
            )}
        </>
    )
}

const getDatesFromRange = (range: [Date] | [Date, Date]): Array<Date> => {
    const [start, end] = range
    if (!end) {
        return [start]
    }
    const rangeLength = end.getDate() - start.getDate()
    const dates: Array<Date> = []

    for (let i = 0; i <= rangeLength; i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        dates.push(date)
    }

    return dates
}

const EntryTable = ({
    dateStr,
    displayEntries,
    del,
    tasks,
    setTimesheetEntries,
}: {
    dateStr: string
    displayEntries: Array<TimesheetEntry>
    del: DeleteHookFunction
    tasks: Array<Task>
    setTimesheetEntries: Dispatch<SetStateAction<Array<TimesheetEntry>>>
}) => {
    const [open, setOpen] = useState<boolean>(false)
    const header = ` - ${displayEntries
        .map((ent) => ent.quantity ?? 0)
        .join(" + ")} hours`

    return (
        <TableContainer
            marginY="1rem"
            marginX="2rem"
            border="#6f6f6f solid 3px"
        >
            <TableHeader
                text={dateStr + (open ? "" : header)}
                button={
                    <Link onClick={() => setOpen((opn) => !opn)}>
                        <Icon
                            as={open ? BsCaretDown : BsCaretLeft}
                            boxSize="1.5rem"
                        />
                    </Link>
                }
            />
            <Table variant="simple">
                {open && (
                    <Tbody>
                        {displayEntries.map(
                            (entry) =>
                                entry.timesheet.project.id && (
                                    <Tr key={`${entry.id}`}>
                                        <TimesheetEntryRow
                                            entry={entry}
                                            deleteTimesheetEntry={del}
                                            date={dateStr}
                                            tasks={taskByProject(
                                                tasks,
                                                entry.timesheet.project.id
                                            )}
                                            setTimesheetEntries={
                                                setTimesheetEntries
                                            }
                                        />
                                    </Tr>
                                )
                        )}
                    </Tbody>
                )}
            </Table>
        </TableContainer>
    )
}

const DayEditor = ({
    timesheets,
    dateRange,
    entries,
    tasks,
    setTimesheetEntries,
    user,
}: DayEditorProps): JSX.Element => {
    const { delete: del } = useUpdateTimesheetEntries(user)

    const [timesheet, setTimesheet] = useState<Timesheet | undefined>(undefined)

    const dates = getDatesFromRange(dateRange)
    const [start, end] = dateRange
    const datesDisplayString = `
        ${toLocalDisplayDate(jsDateToShortISODate(start))}
        ${end ? ` - ${toLocalDisplayDate(jsDateToShortISODate(end))}` : ""}
    `

    const handleTimesheetChange = (
        event: React.FormEvent<HTMLSelectElement>
    ) => {
        event.preventDefault()
        const id = event.currentTarget.value
        if (id) {
            const tms = timesheets.find((_tms) => _tms.id === Number(id))
            if (tms) {
                setTimesheet(tms)
            }
        } else {
            setTimesheet(undefined)
        }
    }

    const onCancel = () => {
        setTimesheet(undefined)
    }

    return (
        <>
            <Header type="sub">{`Create a new entry on ${datesDisplayString}`}</Header>
            <Box paddingX="2rem" paddingY="1rem">
                <Box border="#6f6f6f solid 3px">
                    <Header type="element">
                        <Flex justifyContent="space-evenly" alignItems="center">
                            <FormControl display="flex" justifyContent="start">
                                <FormLabel
                                    htmlFor="select-multiple-dates"
                                    fontWeight="bold"
                                    color="whitesmoke"
                                >
                                    {"Select project: "}
                                </FormLabel>
                                <Select
                                    onChange={handleTimesheetChange}
                                    placeholder=" - "
                                    backgroundColor="whitesmoke"
                                    color="black"
                                >
                                    {timesheets.map((tms) => (
                                        <option
                                            key={`${tms.id}`}
                                            value={tms.id}
                                        >
                                            {tms.project.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <Text
                                style={{ padding: "1rem", color: "whitesmoke" }}
                            >
                                {" or "}
                            </Text>
                            <ImportFromCSVModal
                                setTimesheetEntries={setTimesheetEntries}
                            />
                        </Flex>
                    </Header>
                    <Box paddingX="0.5rem">
                        {timesheet && timesheet.project.id && (
                            <CreateTimesheetEntryForm
                                onCancel={onCancel}
                                timesheet={timesheet}
                                projectId={timesheet.project.id}
                                date={jsDateToShortISODate(dateRange[0])}
                                dates={dates}
                                key={`createEntryEditor-${timesheet.id}`}
                                tasks={taskByProject(
                                    tasks,
                                    timesheet.project.id
                                )}
                                setTimesheetEntries={setTimesheetEntries}
                                user={user}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
            {entries.length > 0 && (
                <Box>
                    <Header type="sub">{`Previous entries`}</Header>
                    {dates.map((ddate) => {
                        const dateStr = jsDateToShortISODate(ddate)
                        const displayEntries = entries.filter(
                            (entry) => entry.date === dateStr
                        )

                        return (
                            <Box key={`timesheet-entry-${ddate}`}>
                                {displayEntries.length > 0 && (
                                    <EntryTable
                                        dateStr={dateStr}
                                        displayEntries={displayEntries}
                                        del={del}
                                        tasks={tasks}
                                        setTimesheetEntries={
                                            setTimesheetEntries
                                        }
                                    />
                                )}
                            </Box>
                        )
                    })}
                </Box>
            )}
        </>
    )
}

interface WeeklyHoursProps {
    entries: TimesheetEntry[]
    dates: [Date] | [Date, Date]
}

const WeeklyHours = ({ entries, dates }: WeeklyHoursProps): JSX.Element => {
    const total = sum(
        entries
            .filter(
                (entry) =>
                    DateTime.fromISO(entry.date) <=
                        DateTime.fromJSDate(dates[0]).endOf("week") &&
                    DateTime.fromISO(entry.date) >=
                        DateTime.fromJSDate(dates[0]).startOf("week")
            )
            .map((item) => item.quantity)
    )

    return (
        <p>
            Hours this week: <b>{round(total, 2)}</b>
        </p>
    )
}

interface monthlyHoursProps {
    entries: TimesheetEntry[]
    dates: [Date] | [Date, Date]
}

const MonthlyHours = ({ entries, dates }: monthlyHoursProps): JSX.Element => {
    const total = sum(
        entries
            .filter(
                (entry) =>
                    DateTime.fromISO(entry.date) <=
                        DateTime.fromJSDate(dates[0]).endOf("month") &&
                    DateTime.fromISO(entry.date) >=
                        DateTime.fromJSDate(dates[0]).startOf("month")
            )
            .map((item) => item.quantity)
    )
    return (
        <p>
            Hours this month: <b>{round(total, 2)}</b>
        </p>
    )
}

export const TimesheetEntryEditor = ({
    entries,
    timesheets,
    tasks,
    user,
}: TimesheetEntryEditorProps): JSX.Element => {
    const [selectInterval, setSelectInterval] = useState<boolean>(false)
    const [dates, setDates] = useState<[Date] | [Date | null, Date | null]>([
        null,
        null,
    ])
    const [timesheetEntries, setTimesheetEntries] =
        useState<TimesheetEntry[]>(entries)

    const holidaysObject = useHoliday()

    const onYearOrMonthChange = ({
        activeStartDate,
    }: ViewCallbackProperties) => {
        setDates([activeStartDate])
    }

    const matchDates = (thisDate: Date) => {
        if (holidaysObject.isSuccess) {
            if (
                holidaysObject.data.some(
                    (item) =>
                        item.date === jsDateToShortISODate(thisDate) &&
                        item.description === "Yleinen vapaapäivä"
                )
            ) {
                return true
            }
        }
        return false
    }

    const onDatesChange = (
        newDates: Date | [Date] | [Date | null, Date | null]
    ) => {
        if (Array.isArray(newDates)) {
            setDates(newDates)
        }
        if (isDate(newDates)) {
            setDates([newDates])
        }
    }

    const ref = useRef(null)

    useOutsideClick({
        ref,
        handler: () => {
            setDates([null, null])
        },
    })
    const entryDates = timesheetEntries.map(({ date: entryDate }) => entryDate)

    return (
        <>
            <>
                <Flex ref={ref} flexDirection="column">
                    <Flex
                        flexDirection="row"
                        paddingX="2rem"
                        paddingY="1rem"
                        justifyContent="center"
                    >
                        <Flex
                            flexDirection="column"
                            alignItems="center"
                            paddingY="1rem"
                            paddingX="1rem"
                            width="100%"
                            backgroundColor="#cfcfcf"
                        >
                            <Box>
                                <Calendar
                                    onChange={onDatesChange}
                                    returnValue={
                                        selectInterval ? "range" : "start"
                                    }
                                    selectRange={selectInterval}
                                    allowPartialRange={true}
                                    onActiveStartDateChange={
                                        onYearOrMonthChange
                                    }
                                    value={datesValue(dates)}
                                    tileClassName={({ date: thisDate }) => {
                                        const classNames = []
                                        if (matchDates(thisDate)) {
                                            classNames.push(
                                                "react-calendar__month-view__public_holidays"
                                            )
                                        }
                                        if (
                                            entryDates.includes(
                                                jsDateToShortISODate(thisDate)
                                            )
                                        ) {
                                            classNames.push(
                                                "react-calendar__tile--completed"
                                            )
                                        }
                                        return classNames.join(" ")
                                    }}
                                    tileContent={({
                                        date,
                                        view,
                                    }: CalendarTileProperties) => {
                                        if (view === "month") {
                                            let content = ""
                                            if (holidaysObject.isSuccess) {
                                                content =
                                                    holidaysObject.data
                                                        .find(
                                                            (item) =>
                                                                item.date ===
                                                                jsDateToShortISODate(
                                                                    date
                                                                )
                                                        )
                                                        ?.summary.toString() ??
                                                    ""
                                            }
                                            return (
                                                <Tooltip
                                                    hasArrow
                                                    label={content}
                                                >
                                                    {content.length > 0 ? (
                                                        <span>
                                                            <Icon
                                                                as={
                                                                    BsSunglasses
                                                                }
                                                                boxSize="2rem"
                                                                position="absolute"
                                                                marginY="-0.6rem"
                                                                marginX="0.1rem"
                                                                zIndex="overlay"
                                                            />
                                                        </span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Tooltip>
                                            )
                                        }
                                        return <></>
                                    }}
                                />
                                <SimpleGrid
                                    paddingY="1rem"
                                    backgroundColor={"#efefef"}
                                    columns={1}
                                >
                                    <Flex justifyContent="space-around">
                                        <FormControl
                                            display="flex"
                                            alignItems="center"
                                            maxWidth="15rem"
                                        >
                                            <FormLabel
                                                htmlFor="select-multiple-dates"
                                                mb="0"
                                                fontWeight="bold"
                                            >
                                                {"Select multiple dates: "}
                                            </FormLabel>
                                            <Switch
                                                id="select-multiple-dates"
                                                isChecked={selectInterval}
                                                onChange={() =>
                                                    setSelectInterval(
                                                        (val) => !val
                                                    )
                                                }
                                                variant="boxy"
                                                colorScheme="gray"
                                            />
                                        </FormControl>
                                        <Flex flexDirection="column">
                                            <WeeklyHours
                                                entries={entries}
                                                dates={datesRange(dates)}
                                            />
                                            <MonthlyHours
                                                entries={entries}
                                                dates={datesRange(dates)}
                                            />
                                        </Flex>
                                    </Flex>
                                </SimpleGrid>
                            </Box>
                        </Flex>
                    </Flex>
                    <Box>
                        <DayEditor
                            timesheets={timesheets}
                            dateRange={datesRange(dates)}
                            entries={timesheetEntries}
                            tasks={tasks}
                            setTimesheetEntries={setTimesheetEntries}
                            user={user}
                        />
                    </Box>
                </Flex>
            </>
        </>
    )
}
