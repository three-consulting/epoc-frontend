import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTimesheetEntries } from "@/lib/hooks/useUpdate"
import {
    Task,
    TimeCategory,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"
import { Heading, Link, Select } from "@chakra-ui/react"
import { round, sum } from "lodash"
import React, { useContext, useState } from "react"
import Calendar, { ViewCallbackProperties } from "react-calendar"
import {
    CreateTimesheetEntryForm,
    EditTimesheetEntryForm,
} from "../form/TimesheetEntryForm"
import { DateTime } from "luxon"
import { DeleteHookFunction } from "@/lib/types/hooks"
import { jsDateToShortISODate, toLocalDisplayDate } from "@/lib/utils/date"

interface TimesheetEntryRowProps {
    entry: TimesheetEntry
    deleteTimesheetEntry: DeleteHookFunction
    dateStr: string
    timeCategories: TimeCategory[]
    tasks: Task[]
}

interface DayEditorProps {
    timesheets: Timesheet[]
    dateRange: [Date] | [Date, Date]
    timeCategories: TimeCategory[]
    entries: TimesheetEntry[]
    tasks: Task[]
}

const taskByProject = (tasks: Task[], projectId: number) =>
    tasks.filter((task) => task.project.id === projectId)

const TimesheetEntryRow = ({
    entry,
    deleteTimesheetEntry,
    dateStr,
    timeCategories,
    tasks,
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
                        entry={entry}
                        timesheet={entry.timesheet}
                        projectId={projectId}
                        date={dateStr}
                        timeCategories={timeCategories}
                        onCancel={() => setEdit(!edit)}
                        afterSubmit={() => setEdit(!edit)}
                        tasks={tasks}
                    />
                    <Link
                        onClick={() =>
                            deleteTimesheetEntry(id, () => undefined)
                        }
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
    timeCategories,
    entries,
    tasks,
}: DayEditorProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { delete: del } = useUpdateTimesheetEntries(user)

    const dates = getDatesFromRange(dateRange)
    const [start, end] = dateRange
    const datesDisplayString = `
        ${toLocalDisplayDate(jsDateToShortISODate(start))}
        ${end ? ` - ${toLocalDisplayDate(jsDateToShortISODate(end))}` : ""}
    `

    const [timesheet, setTimesheet] = useState<Timesheet>()

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
        }
    }

    return (
        <>
            <Heading as="h2" size="md">
                Create a new entry on {datesDisplayString}
            </Heading>
            <Select
                onChange={handleTimesheetChange}
                placeholder="Select project"
                marginRight="0.3rem"
                value={timesheet?.id}
            >
                {timesheets.map((tms) => (
                    <option key={`${tms.id}`} value={tms.id}>
                        {tms.project.name}
                    </option>
                ))}
            </Select>
            {timesheet && timesheet.project.id && (
                <CreateTimesheetEntryForm
                    timesheet={timesheet}
                    projectId={timesheet.project.id}
                    date={jsDateToShortISODate(dateRange[0])}
                    dates={dates}
                    timeCategories={timeCategories}
                    key={`createEntryEditor-${timesheet.id}`}
                    tasks={taskByProject(tasks, timesheet.project.id)}
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
                                            dateStr={dateStr}
                                            timeCategories={timeCategories}
                                            tasks={taskByProject(
                                                tasks,
                                                entry.timesheet.project.id
                                            )}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
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

const isDates = (dates: unknown): dates is [Date, Date] =>
    Array.isArray(dates) &&
    dates.length === 2 &&
    dates[0] !== null &&
    dates[1] !== null

const isNullableDates = (dates: unknown): dates is [Date | null, Date | null] =>
    Array.isArray(dates) && dates.length === 2

const isDate = (dates: unknown): dates is [Date] | [Date, null] =>
    Array.isArray(dates) &&
    ((dates.length === 1 && dates[0] !== null) ||
        (dates.length === 2 && dates[0] !== null && dates[1] === null))

const datesValue = (dates: unknown): Date | [Date | null, Date | null] => {
    if (isNullableDates(dates)) {
        return dates
    }
    if (isDate(dates)) {
        return dates[0]
    }
    return new Date()
}

const datesRange = (dates: unknown): [Date] | [Date, Date] =>
    isDates(dates) ? dates : [new Date()]

interface TimesheetEntryEditorProps {
    entries: TimesheetEntry[]
    timesheets: Timesheet[]
    timeCategories: TimeCategory[]
    tasks: Task[]
}

export const TimesheetEntryEditor = ({
    entries,
    timesheets,
    timeCategories,
    tasks,
}: TimesheetEntryEditorProps): JSX.Element => {
    const [dates, setDates] = useState<[Date] | [Date | null, Date | null]>([
        null,
        null,
    ])

    const onYearOrMonthChange = ({
        activeStartDate,
    }: ViewCallbackProperties) => {
        setDates([activeStartDate])
    }

    const entryDates = entries.map(({ date: entryDate }) => entryDate)

    return (
        <>
            <div>
                <Calendar
                    onChange={setDates}
                    returnValue={"range"}
                    selectRange={true}
                    allowPartialRange={true}
                    onActiveStartDateChange={onYearOrMonthChange}
                    value={datesValue(dates)}
                    tileClassName={({ date: thisDate }) => {
                        if (
                            entryDates.includes(jsDateToShortISODate(thisDate))
                        ) {
                            return "react-calendar__tile--completed"
                        }
                        return ""
                    }}
                />
            </div>
            <WeeklyHours entries={entries} dates={datesRange(dates)} />
            <div style={{ marginBottom: "5px" }} />
            <MonthlyHours entries={entries} dates={datesRange(dates)} />
            <div style={{ marginBottom: "10px" }} />
            <DayEditor
                timesheets={timesheets}
                dateRange={datesRange(dates)}
                timeCategories={timeCategories}
                entries={entries}
                tasks={tasks}
            />
        </>
    )
}
