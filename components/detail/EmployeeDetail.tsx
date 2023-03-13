import { Employee, Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { Flex } from "@chakra-ui/layout"
import React from "react"

type EmployeeDetailProps = {
    employee: Employee
    employeeId: number
    entries: TimesheetEntry[]
    timesheets: Timesheet[]
    tasks: Task[]
}

const EmployeeDetail = ({ employee }: EmployeeDetailProps): JSX.Element => {
    const { email, role, updated, created } = employee
    return (
        <>
            <Flex>Email: {email || "-"}</Flex>
            <Flex>Role: {role || "-"}</Flex>
            {created && <Flex>Created: {toLocalDisplayDate(created)}</Flex>}
            {updated && <Flex>Updated: {toLocalDisplayDate(updated)}</Flex>}
        </>
    )
}

export default EmployeeDetail
