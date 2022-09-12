import { Employee } from "@/lib/types/apiTypes"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { Box, Flex, Heading } from "@chakra-ui/layout"
import React from "react"

type EmployeeDetailProps = {
    employee: Employee
}

const EmployeeDetail = ({ employee }: EmployeeDetailProps): JSX.Element => {
    const { firstName, lastName, email, role, updated, created } = employee
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
                <Box>{`${firstName || "-"} ${lastName || "-"}`}</Box>
            </Heading>
            <Flex>Email: {email || "-"}</Flex>
            <Flex>Role: {role || "-"}</Flex>
            {created && <Flex>Created: {toLocalDisplayDate(created)}</Flex>}
            {updated && <Flex>Updated: {toLocalDisplayDate(updated)}</Flex>}
        </Flex>
    )
}

export default EmployeeDetail
