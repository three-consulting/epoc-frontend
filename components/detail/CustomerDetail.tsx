import { Customer } from "@/lib/types/apiTypes"
import { toLocalDisplayDate } from "@/lib/utils/date"
import { Flex } from "@chakra-ui/layout"
import React from "react"

type CustomerDetailProps = {
    customer: Customer
}

function CustomerDetail({ customer }: CustomerDetailProps): JSX.Element {
    const { description, updated, created } = customer
    return (
        <>
            <Flex>Description: {description}</Flex>
            {created && <Flex>Created: {toLocalDisplayDate(created)}</Flex>}
            {updated && <Flex>Updated: {toLocalDisplayDate(updated)}</Flex>}
        </>
    )
}

export default CustomerDetail
