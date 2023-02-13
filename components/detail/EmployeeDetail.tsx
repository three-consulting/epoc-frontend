import { Employee, Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { Box, Flex, Heading } from "@chakra-ui/layout"
import Link from "next/link"
import React from "react"
import { StyledButton } from "../common/Buttons"
import FormButtons from "../common/FormButtons"
import { TimesheetEntryEditor } from "../editor/TimesheetEntryEditor"

type EmployeeDetailProps = {
    employee: Employee
    employeeId: number
    entries: TimesheetEntry[]
    timesheets: Timesheet[]
    tasks: Task[]
}

const EmployeeDetail = ({
    employee,
    employeeId,
    entries,
    timesheets,
    tasks,
}: EmployeeDetailProps): JSX.Element => {
    const { firstName, lastName, email, role, updated, created } = employee
    return (
        <>
            <Flex
                flexDirection="column"
                backgroundColor="white"
                border="1px solid"
                borderColor="gray.400"
                borderRadius="0.2rem"
                padding="1rem 1rem"
            >
                <Heading>
                    <Box>{`${firstName || "-"} ${lastName || "-"}`}</Box>
                </Heading>
                <Flex>Email: {email || "-"}</Flex>
                <Flex>Role: {role || "-"}</Flex>
                {created && <Flex>Created: {toLocalDisplayDate(created)}</Flex>}
                {updated && <Flex>Updated: {toLocalDisplayDate(updated)}</Flex>}
            </Flex>
            <FormButtons>
                <Link key={`${employeeId}`} href={`${employeeId}/edit`}>
                    <StyledButton buttontype="edit" name="employee" />
                </Link>
            </FormButtons>
            <Flex
                flexDirection="column"
                backgroundColor="white"
                border="1px solid"
                borderColor="gray.400"
                borderRadius="0.2rem"
                padding="1rem 1rem"
            >
                <b>Entries By {`${firstName || "-"} ${lastName || "-"}`}</b>
                <TimesheetEntryEditor
                    entries={entries}
                    timesheets={timesheets}
                    tasks={tasks}
                ></TimesheetEntryEditor>
            </Flex>
        </>
    )
}

export default EmployeeDetail
