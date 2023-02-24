import { Employee } from "@/lib/types/apiTypes"
import { Box } from "@chakra-ui/layout"
import {
    Alert,
    AlertIcon,
    AlertTitle,
    FormControl,
    FormLabel,
    Switch,
    Tbody,
} from "@chakra-ui/react"
import { Table, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import Link from "next/link"
import { User } from "firebase/auth"
import { ApiGetResponse } from "@/lib/types/hooks"
import { firebaseSyncEndpoint, useGet } from "@/lib/hooks/swrInterface"
import FormSection from "../common/FormSection"
import FormButtons from "../common/FormButtons"
import { CustomButton } from "../common/Buttons"
import { split } from "@/lib/utils/common"

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
                <CustomButton
                    text="Sync employees"
                    colorScheme="blue"
                    onClick={() => setShouldSync(true)}
                />
            </Box>
        </>
    )
}

interface EmployeeTableProps {
    user: User
    employees: Employee[]
    setEmployeesResponse: Dispatch<SetStateAction<ApiGetResponse<Employee[]>>>
}

interface ITableComponent {
    employees: Array<Employee>
}

const TableComponent = ({ employees }: ITableComponent): JSX.Element => (
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
                <EmployeeRow employee={employee} key={`${employee.id}`} />
            ))}
        </Tbody>
    </Table>
)

const isArchived = (emp: Employee): boolean => emp.status === "ARCHIVED"

const EmployeeTable = ({
    user,
    employees,
    setEmployeesResponse,
}: EmployeeTableProps): JSX.Element => {
    const [archivedEmployees, activeEmployees] = split(employees, isArchived)
    const [showArchived, setShowArchived] = useState<boolean>(false)

    return (
        <>
            <FormSection
                header={
                    activeEmployees.length > 0
                        ? "Active employees"
                        : "No active employees"
                }
            >
                {activeEmployees.length > 0 ? (
                    <TableComponent employees={activeEmployees} />
                ) : (
                    <Box borderWidth="1px" padding="1rem" margin="1rem">
                        No employees have been added yet.
                    </Box>
                )}
                <FormButtons>
                    <SyncEmployeesButton
                        user={user}
                        setEmployeesResponse={setEmployeesResponse}
                    />
                </FormButtons>
            </FormSection>
            {archivedEmployees.length > 0 && (
                <>
                    {showArchived && (
                        <FormSection header={"Archived employees"}>
                            <TableComponent employees={archivedEmployees} />
                        </FormSection>
                    )}
                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="show-archived" mb="0">
                            {"Show archived employees: "}
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

export default EmployeeTable
