import {
    Employee,
    Task,
    TimeCategory,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { Box, Flex, Heading } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"
import { TimesheetEntryEditor } from "../editor/TimesheetEntryEditor"

type EmployeeDetailProps = {
    employee: Employee
    employeeId: number
    entries: TimesheetEntry[]
    timesheets: Timesheet[]
    timeCategories: TimeCategory[]
    tasks: Task[]
}

const EmployeeDetail = ({
    employee,
    employeeId,
    entries,
    timesheets,
    timeCategories,
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
            <Link key={`${employeeId}`} href={`${employeeId}/edit`}>
                <Button colorScheme="blue" marginTop="1rem">
                    Edit employee
                </Button>
            </Link>
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
                    timeCategories={timeCategories}
                    tasks={tasks}
                ></TimesheetEntryEditor>
            </Flex>
        </>
    )
}

export default EmployeeDetail
