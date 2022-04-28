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
                />
            )}
            <Heading as="h2" size="md">
                Previous entries on {displayString}
            </Heading>
            {displayEntries.map((entry) => {
                const { id } = entry
                const projectId = entry.timesheet.project.id
                if (id && projectId) {
                    return (
                        <div key={`${entry.id}-container`}>
                            <b>Project: {entry.timesheet.project.name}</b>
                            <EditTimesheetEntryForm
                                key={`${entry.id}`}
                                entry={entry}
                                timesheet={entry.timesheet}
                                projectId={projectId}
                                date={dateStr}
                                timeCategories={timeCategories}
                            />
                            <Link
                                key={`delete-${entry.id}`}
                                onClick={() => deleteTimesheetEntry(id)}
                            >
                                delete
                            </Link>
                        </div>
                    )
                }
                return null
            })}
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
