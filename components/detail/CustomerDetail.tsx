import { Customer } from "@/lib/types/apiTypes"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { Box, Flex, Heading } from "@chakra-ui/layout"
import React from "react"

type CustomerDetailProps = {
    customer: Customer
}

function CustomerDetail({ customer }: CustomerDetailProps): JSX.Element {
    const { name, description, updated, created } = customer
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
            {created && <Flex>Created: {toLocalDisplayDate(created)}</Flex>}
            {updated && <Flex>Updated: {toLocalDisplayDate(updated)}</Flex>}
        </Flex>
    )
}

export default CustomerDetail
