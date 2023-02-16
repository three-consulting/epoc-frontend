import { Customer } from "@/lib/types/apiTypes"
import { Box } from "@chakra-ui/layout"
import { FormControl, FormLabel, Switch, Tbody } from "@chakra-ui/react"
import { Table, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React, { useState } from "react"
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

    const activeCustomers = customers.filter((cst) => cst.enabled)
    const archivedCustomers = customers.filter((cst) => !cst.enabled)

    const [showArchived, setShowArchived] = useState<boolean>(false)

    return (
        <>
            <FormSection
                header={
                    activeCustomers
                        ? "Active customers"
                        : "No active customers found"
                }
            >
                {activeCustomers.length ? (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {activeCustomers.map((customer) => (
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
            {archivedCustomers && archivedCustomers.length > 0 && (
                <>
                    {showArchived && (
                        <FormSection header={"Archived customers"}>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Name</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {archivedCustomers.map((customer) => (
                                        <CustomerRow
                                            customer={customer}
                                            key={`${customer.id}`}
                                        />
                                    ))}
                                </Tbody>
                            </Table>
                        </FormSection>
                    )}
                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="show-archived" mb="0">
                            {"Show archived customers: "}
                        </FormLabel>
                        <Switch
                            id="show-archived"
                            onChange={() =>
                                setShowArchived((shw) => (shw ? !shw : shw))
                            }
                        />
                    </FormControl>
                </>
            )}
        </>
    )
}

export default CustomerTable
