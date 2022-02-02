import { Timesheet } from "@/lib/types/apiTypes"
import { Box, Flex, Heading } from "@chakra-ui/layout"
import React from "react"

type TimesheetDetailProps = {
    timesheet: Timesheet
}

function TimesheetDetail({ timesheet }: TimesheetDetailProps): JSX.Element {
    const { name, description, allocation, project, employee, created, updated, status } = timesheet
    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            <Heading>
                <Box>{name}</Box>
            </Heading>
            <Flex>Description: {description}</Flex>
            <Flex>Allocation: {allocation}</Flex>
            <Flex>Project id: {project.id}</Flex>
            <Flex>Project name: {project.name}</Flex>
            <Flex>Created: {created}</Flex>
            <Flex>Updated: {updated}</Flex>
            <Flex>
                Employee: {employee.firstName} {employee.lastName}
            </Flex>
            <Flex>Timesheet status: {status}</Flex>
        </Flex>
    )
}

export default TimesheetDetail
