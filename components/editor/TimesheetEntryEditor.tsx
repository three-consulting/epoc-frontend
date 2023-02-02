import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTimesheetEntries } from "@/lib/hooks/useUpdate"
import { Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { round, sum } from "lodash"
import { Heading, Link, Select, useOutsideClick } from "@chakra-ui/react"
import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useRef,
    useState,
} from "react"
import Calendar, { ViewCallbackProperties } from "react-calendar"
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

type TSetState<T> = Dispatch<SetStateAction<T>>

interface TimesheetEntryEditorProps {
    entries: TimesheetEntry[]
    timesheets: Timesheet[]
    tasks: Task[]
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
        <div>
            <Link
                onClick={() => setEdit(!edit)}
                style={{
                    marginRight: ".5rem",
                    fontWeight: "bold",
                }}
            >
                {round(entry.quantity, 2)} Hours on{" "}
                {entry.timesheet.project.name}
            </Link>
            {edit && projectId && id && (
                <>
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
                        style={{
                            marginLeft: ".5rem",
                            fontWeight: "bold",
                        }}
                    >
                        Delete
                    </Link>
                </>
            )}
        </div>
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

const DayEditor = ({
    timesheets,
    dateRange,
    entries,
    tasks,
    setTimesheetEntries,
}: DayEditorProps): JSX.Element => {
    const { user } = useContext(UserContext)
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
            <Heading as="h2" size="md">
                Create a new entry on {datesDisplayString}
            </Heading>
            <Select onChange={handleTimesheetChange} marginRight="0.3rem">
                {[
                    <option key={""} value={""}>
                        {"Select project"}
                    </option>,
                ].concat(
                    timesheets.map((tms) => (
                        <option key={`${tms.id}`} value={tms.id}>
                            {tms.project.name}
                        </option>
                    ))
                )}
            </Select>
            {timesheet && timesheet.project.id && (
                <CreateTimesheetEntryForm
                    onCancel={onCancel}
                    timesheet={timesheet}
                    projectId={timesheet.project.id}
                    date={jsDateToShortISODate(dateRange[0])}
                    dates={dates}
                    key={`createEntryEditor-${timesheet.id}`}
                    tasks={taskByProject(tasks, timesheet.project.id)}
                    setTimesheetEntries={setTimesheetEntries}
                />
            )}
            {dates.map((ddate) => {
                const dateStr = jsDateToShortISODate(ddate)
                const displayString = toLocalDisplayDate(dateStr)
                const displayEntries = entries.filter(
                    (entry) => entry.date === dateStr
                )

                return (
                    <React.Fragment key={`timesheet-entry-${ddate}`}>
                        {displayEntries.length > 0 && (
                            <>
                                <Heading as="h2" size="md">
                                    Previous entries on {displayString}
                                </Heading>
                                <ul>
                                    {displayEntries.map((entry) => (
                                        <li
                                            key={`timesheet-entry-${entry.id}-editor-container`}
                                            style={{ margin: "20px" }}
                                        >
                                            {entry.timesheet.project.id && (
                                                <TimesheetEntryRow
                                                    entry={entry}
                                                    deleteTimesheetEntry={del}
                                                    date={dateStr}
                                                    tasks={taskByProject(
                                                        tasks,
                                                        entry.timesheet.project
                                                            .id
                                                    )}
                                                    setTimesheetEntries={
                                                        setTimesheetEntries
                                                    }
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </React.Fragment>
                )
            })}
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

const formatDate = (date: string) => {
    const parts = date.split("-")
    const rearrangedParts = [parts[2], parts[1], parts[0]]
    return rearrangedParts.join("-")
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
}: TimesheetEntryEditorProps): JSX.Element => {
    const [dates, setDates] = useState<[Date] | [Date | null, Date | null]>([
        null,
        null,
    ])
    const [timesheetEntries, setTimesheetEntries] =
        useState<TimesheetEntry[]>(entries)

    const [range, setRange] = useState(true)
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

    const ref = useRef(null)

    useOutsideClick({
        ref,
        handler: () => {
            if (range) {
                setRange(false)
            }
        },
    })
    const entryDates = timesheetEntries.map(({ date: entryDate }) => entryDate)

    return (
        <div ref={ref}>
            <Calendar
                onClickDay={() => setRange(true)}
                onChange={setDates}
                returnValue={"range"}
                selectRange={range}
                allowPartialRange={true}
                onActiveStartDateChange={onYearOrMonthChange}
                value={datesValue(dates)}
                tileClassName={({ date: thisDate }) => {
                    const classNames = []
                    if (matchDates(thisDate)) {
                        classNames.push(
                            "react-calendar__month-view__public_holidays"
                        )
                    }
                    if (entryDates.includes(jsDateToShortISODate(thisDate))) {
                        classNames.push("react-calendar__tile--completed")
                    }
                    return classNames.join(" ")
                }}
            />
            {dates && holidaysObject.isSuccess ? (
                <b className="holiday-summary">
                    {
                        holidaysObject.data.find((item) =>
                            dates[0]
                                ? item.date === jsDateToShortISODate(dates[0])
                                : false
                        )?.summary
                    }
                </b>
            ) : (
                ""
            )}
            <WeeklyHours entries={entries} dates={datesRange(dates)} />
            <div style={{ marginBottom: "5px" }} />
            <MonthlyHours entries={entries} dates={datesRange(dates)} />
            <div style={{ marginBottom: "10px" }} />
            <DayEditor
                timesheets={timesheets}
                dateRange={datesRange(dates)}
                entries={timesheetEntries}
                tasks={tasks}
                setTimesheetEntries={setTimesheetEntries}
            />
            <div style={{ marginBottom: "2rem" }} />
            <ImportFromCSVModal setTimesheetEntries={setTimesheetEntries} />
        </div>
    )
}
