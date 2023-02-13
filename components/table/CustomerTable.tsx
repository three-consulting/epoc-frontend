import { Customer } from "@/lib/types/apiTypes"
import { Box } from "@chakra-ui/layout"
import { Tbody } from "@chakra-ui/react"
import { Table, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React from "react"
import Link from "next/link"
import FormSection from "../common/FormSection"
import FormButtons from "../common/FormButtons"
import { StyledButton } from "../common/Buttons"
import { useRouter } from "next/router"

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
    const router = useRouter()
    return (
        <FormSection
            header={customers ? "All customers" : "No customers found"}
        >
            {customers.length ? (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {customers.map((customer) => (
                            <CustomerRow
                                customer={customer}
                                key={`${customer.id}`}
                            />
                        ))}
                    </Tbody>
                </Table>
            ) : (
                <Box borderWidth="1px" padding="1rem" margin="1rem">
                    No customers have been added yet.
                </Box>
            )}
            <FormButtons>
                <StyledButton
                    buttontype="add"
                    name="customer"
                    onClick={() => router.push("/customer/new")}
                />
            </FormButtons>
        </FormSection>
    )
}

export default CustomerTable
