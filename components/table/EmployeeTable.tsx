import { Employee } from "@/lib/types/apiTypes"
import { Box } from "@chakra-ui/layout"
import { Alert, AlertIcon, AlertTitle, Button, Tbody } from "@chakra-ui/react"
import { Table, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import Link from "next/link"
import { User } from "firebase/auth"
import { ApiGetResponse } from "@/lib/types/hooks"
import { firebaseSyncEndpoint, useGet } from "@/lib/hooks/swrInterface"

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

interface ISyncEmployeesButton {
    user: User
    setEmployeesResponse: Dispatch<SetStateAction<ApiGetResponse<Employee[]>>>
}

export const SyncEmployeesButton = ({
    user,
    setEmployeesResponse,
}: ISyncEmployeesButton): JSX.Element => {
    const [shouldSync, setShouldSync] = useState<boolean>(false)

    const employeeSyncResponse = useGet<Employee[]>(
        user,
        shouldSync ? firebaseSyncEndpoint("employee-sync") : null
    )

    useEffect(() => {
        if (shouldSync && employeeSyncResponse?.isSuccess) {
            setEmployeesResponse(employeeSyncResponse)
            setShouldSync(false)
        }
    }, [shouldSync, employeeSyncResponse])

    return (
        <>
            <Box margin="1rem 0rem">
                {employeeSyncResponse?.isError && (
                    <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Could not sync employees!</AlertTitle>
                    </Alert>
                )}
            </Box>
            <Box margin="1rem 0rem">
                <Button
                    colorScheme={"blue"}
                    onClick={() => setShouldSync(true)}
                >
                    {"Sync employees"}
                </Button>
            </Box>
        </>
    )
}

interface EmployeeTableProps {
    user: User
    employeesResponse?: ApiGetResponse<Employee[]>
    setEmployeesResponse: Dispatch<SetStateAction<ApiGetResponse<Employee[]>>>
}

const EmployeeTable = ({
    user,
    employeesResponse,
    setEmployeesResponse,
}: EmployeeTableProps): JSX.Element => (
    <>
        <Box
            backgroundColor="white"
            border="solid 0.5px"
            borderColor="gray.400"
            borderRadius="0.2rem"
        >
            {employeesResponse?.isSuccess && employeesResponse?.data?.length ? (
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
                        {employeesResponse.data.map((employee) => (
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
        <SyncEmployeesButton
            user={user}
            setEmployeesResponse={setEmployeesResponse}
        />
    </>
)

export default EmployeeTable
