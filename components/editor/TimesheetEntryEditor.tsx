import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTimesheetEntries } from "@/lib/hooks/useTimesheetEntries"
import { TimeCategory, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { Heading, Link, Select } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import Calendar from "react-calendar"
import {
    CreateTimesheetEntryForm,
    EditTimesheetEntryForm,
} from "../form/TimesheetEntryForm"

interface TimesheetEntryRowProps {
    entry: TimesheetEntry
    deleteTimesheetEntry: (entryId: number) => void
    dateStr: string
    timeCategories: TimeCategory[]
}

interface DayEditorProps {
    timesheets: Timesheet[]
    date: Date
    timeCategories: TimeCategory[]
    entries: TimesheetEntry[]
}

const dateToString = (date: Date): string => {
    const sliceIndex = -2
    const [day, month, year] = date.toLocaleDateString("fin").split(".")
    return `${year}-${`0${month}`.slice(sliceIndex)}-${`0${day}`.slice(
        sliceIndex
    )}`
}

const TimesheetEntryRow = ({
    entry,
    deleteTimesheetEntry,
    dateStr,
    timeCategories,
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
                    />
                    <Link
                        onClick={() => deleteTimesheetEntry(id)}
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
}: DayEditorProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { deleteTimesheetEntry } = useUpdateTimesheetEntries(user)

    const dateStr = dateToString(date)
    const displayString = date.toLocaleDateString("fin")

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
                {timesheets.map((tms, idx) => (
                    <option key={idx} value={tms.id}>
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
                        <TimesheetEntryRow
                            entry={entry}
                            deleteTimesheetEntry={deleteTimesheetEntry}
                            dateStr={dateStr}
                            timeCategories={timeCategories}
                        />
                    </li>
                ))}
            </ul>
        </>
    )
}

interface TimesheetEntryEditorProps {
    entries: TimesheetEntry[]
    timesheets: Timesheet[]
    timeCategories: TimeCategory[]
}

export function TimesheetEntryEditor({
    entries,
    timesheets,
    timeCategories,
}: TimesheetEntryEditorProps): JSX.Element {
    const [date, onDateChange] = useState(new Date())

    const entryDates = entries.map(({ date: entryDate }) => entryDate)

    return (
        <>
            <div>
                <Calendar
                    onChange={onDateChange}
                    value={date}
                    tileClassName={({ date: thisDate }) => {
                        if (entryDates.includes(dateToString(thisDate))) {
                            return "react-calendar__tile--completed"
                        }
                        return ""
                    }}
                />
            </div>
            <DayEditor
                timesheets={timesheets}
                date={date}
                timeCategories={timeCategories}
                entries={entries}
            />
        </>
    )
}
