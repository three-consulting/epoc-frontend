import { Timesheet } from "@/lib/types/apiTypes"
import { Flex } from "@chakra-ui/layout"
import React from "react"

interface ITimesheetDetail {
    timesheet: Timesheet
}

const TimesheetDetail = ({ timesheet }: ITimesheetDetail): JSX.Element => {
    const {
        description,
        allocation,
        rate,
        project,
        employee,
        created,
        updated,
        status,
    } = timesheet
    return (
        <>
            <Flex>Description: {description}</Flex>
            <Flex>Allocation: {allocation}</Flex>
            <Flex>Rate: {rate}€/h</Flex>
            <Flex>Project id: {project.id}</Flex>
            <Flex>Project name: {project.name}</Flex>
            <Flex>Created: {created}</Flex>
            <Flex>Updated: {updated}</Flex>
            <Flex>
                Employee: {employee.firstName} {employee.lastName}
            </Flex>
            <Flex>Timesheet status: {status}</Flex>
        </>
    )
}

export default TimesheetDetail
