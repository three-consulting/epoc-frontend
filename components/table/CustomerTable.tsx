import { Customer } from "@/lib/types/apiTypes"
import { Box } from "@chakra-ui/layout"
import { Tbody } from "@chakra-ui/react"
import { Table, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React, { useState } from "react"
import { FromButton, NewCustomerModal } from "../common/FormFields"
import Link from "next/link"

interface CustomerRowProps {
    customer: Customer
}

function CustomerRow({ customer }: CustomerRowProps): JSX.Element {
    return (
        <Link href={`customer/${customer.id}`}>
            <Tr _hover={{ backgroundColor: "gray.200", cursor: "pointer" }}>
                <Td>{customer.name}</Td>
            </Tr>
        </Link>
    )
}

interface CustomerTableProps {
    customers: Customer[]
}

function CustomerTable({ customers }: CustomerTableProps): JSX.Element {
    const [displayCreateCustomerForm, setDisplayCreateCustomerForm] =
        useState(false)
    return (
        <>
            <Box
                backgroundColor="white"
                border="solid 0.5px"
                borderColor="gray.400"
                borderRadius="0.2rem"
            >
                {customers.length ? (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {customers.map((customer, idx) => (
                                <CustomerRow customer={customer} key={idx} />
                            ))}
                        </Tbody>
                    </Table>
                ) : (
                    <Box borderWidth="1px" padding="1rem" margin="1rem">
                        No customers have been added yet.
                    </Box>
                )}
            </Box>
            <Box margin="1rem 0rem">
                <FromButton
                    buttonName="Add Customer"
                    buttonColor="blue"
                    onClick={() => setDisplayCreateCustomerForm(true)}
                />
                <NewCustomerModal
                    displayCreateCustomerForm={displayCreateCustomerForm}
                    setDisplayCreateCustomerForm={setDisplayCreateCustomerForm}
                />
            </Box>
        </>
    )
}

export default CustomerTable
