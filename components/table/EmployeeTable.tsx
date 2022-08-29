import { Employee } from "@/lib/types/apiTypes"
import { Box } from "@chakra-ui/layout"
import { Tbody } from "@chakra-ui/react"
import { Table, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React from "react"
import Link from "next/link"
import { FromButton, NewEmployeeModal } from "../common/FormFields"

interface EmployeeRowProps {
    employee: Employee
}

const EmployeeRow = ({ employee }: EmployeeRowProps): JSX.Element => (
    <Link href={`employee/${employee.id}`}>
        <Tr _hover={{ backgroundColor: "gray.200", cursor: "pointer" }}>
            <Td>{employee.firstName}</Td>
            <Td>{employee.lastName}</Td>
            <Td>{employee.email}</Td>
            <Td>{employee.role}</Td>
        </Tr>
    </Link>
)

interface EmployeeTableProps {
    employees: Employee[]
}

const EmployeeTable = ({ employees }: EmployeeTableProps): JSX.Element => {
    const [displayCreateEmployeeForm, setDisplayCreateEmployeeForm] =
        React.useState(false)
    return (
        <>
            <Box
                backgroundColor="white"
                border="solid 0.5px"
                borderColor="gray.400"
                borderRadius="0.2rem"
            >
                {employees.length ? (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>First name</Th>
                                <Th>Last name</Th>
                                <Th>Email</Th>
                                <Th>Role</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {employees.map((employee) => (
                                <EmployeeRow
                                    employee={employee}
                                    key={`${employee.id}`}
                                />
                            ))}
                        </Tbody>
                    </Table>
                ) : (
                    <Box borderWidth="1px" padding="1rem" margin="1rem">
                        No employees have been added yet.
                    </Box>
                )}
            </Box>
            <Box margin="1rem 0rem">
                <FromButton
                    buttonName="Add Employee"
                    buttonColor="blue"
                    onClick={() => setDisplayCreateEmployeeForm(true)}
                />
                <NewEmployeeModal
                    displayCreateEmployeeForm={displayCreateEmployeeForm}
                    setDisplayCreateEmployeeForm={setDisplayCreateEmployeeForm}
                />
            </Box>
        </>
    )
}

export default EmployeeTable
