import { Customer } from "@/lib/types/apiTypes"
import { Box, Flex, Heading } from "@chakra-ui/layout"
import React from "react"

type CustomerDetailProps = {
    customer: Customer
}

function CustomerDetail({ customer }: CustomerDetailProps): JSX.Element {
    const { name, description, updated, created } = customer
    const getDisplayDate = (date: string) => new Date(date).toLocaleDateString()
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
            {created && <Flex>Created: {getDisplayDate(created)}</Flex>}
            {updated && <Flex>Updated: {getDisplayDate(updated)}</Flex>}
        </Flex>
    )
}

export default CustomerDetail
