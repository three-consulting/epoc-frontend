import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTimesheetEntries } from "@/lib/hooks/useTimesheetEntries"
import {
    Task,
    TimeCategory,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"
import { Heading, Link } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import Calendar from "react-calendar"
import {
    CreateTimesheetEntryForm,
    EditTimesheetEntryForm,
} from "../form/TimesheetEntryForm"

interface DayEditorProps {
    timesheet: Timesheet
    tasks: Task[]
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
    timesheet,
    tasks,
    date,
    timeCategories,
    entries,
}: DayEditorProps): JSX.Element => {
    const { user } = useContext(UserContext)
    const { deleteTimesheetEntry } = useUpdateTimesheetEntries(user)

    const dateStr = dateToString(date)
    const displayString = date.toLocaleDateString("fin")

    const displayEntries = entries.filter((entry) => entry.date === dateStr)

    return (
        <>
            <Heading as="h2" size="md">
                Create a new entry on {displayString}
            </Heading>
            <CreateTimesheetEntryForm
                timesheet={timesheet}
                tasks={tasks}
                date={dateStr}
                timeCategories={timeCategories}
            />
            <Heading as="h2" size="md">
                Previous entries on {displayString}
            </Heading>
            {displayEntries.map((entry) => {
                if (entry.id) {
                    const { id } = entry
                    return (
                        <div key={`${entry.id}-container`}>
                            <EditTimesheetEntryForm
                                key={`${entry.id}`}
                                entry={entry}
                                timesheet={timesheet}
                                tasks={tasks}
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
    timesheet: Timesheet
    timeCategories: TimeCategory[]
    tasks: Task[]
}

export function TimesheetEntryEditor({
    entries,
    timesheet,
    tasks,
    timeCategories,
}: TimesheetEntryEditorProps): JSX.Element {
    const projectName = timesheet.project.name
    const employeeName = timesheet.employee.firstName
    const [date, onDateChange] = useState(new Date())

    const entryDates = entries.map(({ date: entryDate }) => entryDate)

    return (
        <>
            <Heading fontWeight="black" margin="1rem 0rem">
                Entries of {employeeName} in {projectName}
            </Heading>
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
                timesheet={timesheet}
                date={date}
                tasks={tasks}
                timeCategories={timeCategories}
                entries={entries}
            />
        </>
    )
}
