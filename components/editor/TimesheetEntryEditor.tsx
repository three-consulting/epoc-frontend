import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTimesheetEntries } from "@/lib/hooks/useUpdate"
import {
    Task,
    TimeCategory,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"
import { Heading, Link, Select } from "@chakra-ui/react"
import { sum } from "lodash"
import React, { useContext, useState } from "react"
import Calendar, { ViewCallbackProperties } from "react-calendar"
import {
    CreateTimesheetEntryForm,
    EditTimesheetEntryForm,
} from "../form/TimesheetEntryForm"
import { DateTime } from "luxon"
import { DeleteHookFunction } from "@/lib/types/hooks"

interface TimesheetEntryRowProps {
    entry: TimesheetEntry
    deleteTimesheetEntry: DeleteHookFunction
    dateStr: string
    timeCategories: TimeCategory[]
    tasks: Task[]
}

interface DayEditorProps {
    timesheets: Timesheet[]
    date: Date
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
                {entry.quantity} Hours on {entry.timesheet.project.name}
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

const DayEditor = ({
    timesheets,
    date,
    timeCategories,
    entries,
    tasks,
}: DayEditorProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { delete: del } = useUpdateTimesheetEntries(user)

    const dateStr = date.toISOString().slice(0, 10)
    const displayString = date.toLocaleDateString()

    const displayEntries = entries.filter((entry) => entry.date === dateStr)
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
                Create a new entry on {displayString}
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
                    date={dateStr}
                    timeCategories={timeCategories}
                    key={`createEntryEditor-${timesheet.id}`}
                    tasks={taskByProject(tasks, timesheet.project.id)}
                />
            )}
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
        </>
    )
}

interface WeeklyHoursProps {
    entries: TimesheetEntry[]
    date: Date
}

function WeeklyHours({ entries, date }: WeeklyHoursProps): JSX.Element {
    const total = sum(
        entries
            .filter(
                (entry) =>
                    DateTime.fromISO(entry.date) <=
                        DateTime.fromJSDate(date).endOf("week") &&
                    DateTime.fromISO(entry.date) >=
                        DateTime.fromJSDate(date).startOf("week")
            )
            .map((item) => item.quantity)
    )

    return (
        <p>
            Hours this week: <b>{total}</b>
        </p>
    )
}

interface monthlyHoursProps {
    entries: TimesheetEntry[]
    date: Date
}

function MonthlyHours({ entries, date }: monthlyHoursProps): JSX.Element {
    const total = sum(
        entries
            .filter(
                (entry) =>
                    DateTime.fromISO(entry.date) <=
                        DateTime.fromJSDate(date).endOf("month") &&
                    DateTime.fromISO(entry.date) >=
                        DateTime.fromJSDate(date).startOf("month")
            )
            .map((item) => item.quantity)
    )
    return (
        <p>
            Hours this month: <b>{total}</b>
        </p>
    )
}

interface TimesheetEntryEditorProps {
    entries: TimesheetEntry[]
    timesheets: Timesheet[]
    timeCategories: TimeCategory[]
    tasks: Task[]
}

export function TimesheetEntryEditor({
    entries,
    timesheets,
    timeCategories,
    tasks,
}: TimesheetEntryEditorProps): JSX.Element {
    const [date, setDate] = useState(new Date())

    const onYearOrMonthChange = ({
        activeStartDate,
    }: ViewCallbackProperties) => {
        setDate(activeStartDate)
    }

    const entryDates = entries.map(({ date: entryDate }) => entryDate)

    return (
        <>
            <div>
                <Calendar
                    onChange={setDate}
                    onActiveStartDateChange={onYearOrMonthChange}
                    value={date}
                    tileClassName={({ date: thisDate }) => {
                        if (
                            entryDates.includes(
                                DateTime.fromJSDate(thisDate)
                                    .toISO()
                                    .slice(0, 10)
                            )
                        ) {
                            return "react-calendar__tile--completed"
                        }
                        return ""
                    }}
                />
            </div>
            <WeeklyHours entries={entries} date={date} />
            <div style={{ marginBottom: "5px" }} />
            <MonthlyHours entries={entries} date={date} />
            <div style={{ marginBottom: "10px" }} />
            <DayEditor
                timesheets={timesheets}
                date={date}
                timeCategories={timeCategories}
                entries={entries}
                tasks={tasks}
            />
        </>
    )
}
