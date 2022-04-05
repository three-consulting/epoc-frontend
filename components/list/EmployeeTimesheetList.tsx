import React from "react"
import { Employee, Timesheet } from "@/lib/types/apiTypes"
import { Heading, Link } from "@chakra-ui/react"

interface TimesheetItemProps {
    id: number
    timesheet: Timesheet
}

function TimesheetItem({ id, timesheet }: TimesheetItemProps): JSX.Element {
    const url = `/timesheet/${id}/entries`
    return (
        <li>
            <Link href={url}>{timesheet.project.name}</Link>
        </li>
    )
}

interface EmployeeTimesheetListProps {
    employee: Employee
    timesheets: Timesheet[]
}

export function EmployeeTimesheetList({
    employee,
    timesheets,
}: EmployeeTimesheetListProps): JSX.Element {
    return (
        <div>
            <Heading fontWeight="black" margin="1rem 0rem">
                Timesheets of {employee.firstName} {employee.lastName}
            </Heading>
            <ul>
                {timesheets.map(
                    (timesheet) =>
                        timesheet.id && (
                            <TimesheetItem
                                key={timesheet.id}
                                id={timesheet.id}
                                timesheet={timesheet}
                            />
                        )
                )}
            </ul>
        </div>
    )
}
