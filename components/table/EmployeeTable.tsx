import { Employee } from "@/lib/types/apiTypes"
import { Box } from "@chakra-ui/layout"
import { Alert, AlertIcon, AlertTitle, Tbody } from "@chakra-ui/react"
import { Table, Td, Th, Thead, Tr } from "@chakra-ui/table"
import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react"
import Link from "next/link"
import { ApiGetResponse } from "@/lib/types/hooks"
import FormSection from "../common/FormSection"
import StyledButtons from "../common/StyledButtons"
import { CustomButton } from "../common/Buttons"
import { MediaContext } from "@/lib/contexts/MediaContext"
import { useEmployeeSync } from "@/lib/hooks/misc"

interface EmployeeRowProps {
    employee: Employee
    isLarge: boolean
}

const EmployeeRow = ({ employee, isLarge }: EmployeeRowProps): JSX.Element => (
    <Link href={`employee/${employee.id}`}>
        <Tr _hover={{ backgroundColor: "gray.200", cursor: "pointer" }}>
            <Td>{employee.firstName}</Td>
            <Td>{employee.lastName}</Td>
            {isLarge && (
                <>
                    <Td>{employee.email}</Td>
                    <Td>{employee.role}</Td>
                    <Td>{employee.status}</Td>
                </>
            )}
        </Tr>
    </Link>
)

interface ISyncEmployeesButton {
    setEmployeesResponse: Dispatch<SetStateAction<ApiGetResponse<Employee[]>>>
}

export const SyncEmployeesButton = ({
    setEmployeesResponse,
}: ISyncEmployeesButton): JSX.Element => {
    const [shouldSync, setShouldSync] = useState<boolean>(false)

    const employeeSyncResponse = useEmployeeSync(shouldSync)

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
    employeesResponse?: ApiGetResponse<Employee[]>
    setEmployeesResponse: Dispatch<SetStateAction<ApiGetResponse<Employee[]>>>
}

const EmployeeTable = ({
    employeesResponse,
    setEmployeesResponse,
}: EmployeeTableProps): JSX.Element => {
    const { isLarge } = useContext(MediaContext)

    const getHeader = () =>
        employeesResponse?.isSuccess && employeesResponse.data.length > 0
            ? "All users"
            : "No users found"
    return (
        <FormSection header={getHeader()}>
            {employeesResponse?.isSuccess && employeesResponse?.data?.length ? (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>First name</Th>
                            <Th>Last name</Th>
                            {isLarge && (
                                <>
                                    <Th>Email</Th>
                                    <Th>Role</Th>
                                    <Th>Status</Th>
                                </>
                            )}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {employeesResponse.data.map((employee) => (
                            <EmployeeRow
                                employee={employee}
                                isLarge={isLarge}
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
            <StyledButtons>
                <SyncEmployeesButton
                    setEmployeesResponse={setEmployeesResponse}
                />
            </StyledButtons>
        </FormSection>
    )
}

export default EmployeeTable
