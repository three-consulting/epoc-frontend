import React, { useCallback, useContext, useEffect, useState } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import EmployeeTable from "@/components/table/EmployeeTable"
import { AuthContext, UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useEmployees } from "@/lib/hooks/useList"
import { ApiGetResponse } from "@/lib/types/hooks"
import { Employee } from "@/lib/types/apiTypes"
import { Role } from "@/lib/types/auth"
import AuthErrorAlert from "@/components/common/AuthErrorAlert"

const Employees: NextPage = () => {
    const { user } = useContext(UserContext)
    const { role } = useContext(AuthContext)
    const initialEmployeeResponse = useEmployees(user)

    const [employeesResponse, setEmployeesResponse] = useState<
        ApiGetResponse<Employee[]>
    >(initialEmployeeResponse)

    const getLoadedEmployees = useCallback(
        () => initialEmployeeResponse,
        [initialEmployeeResponse]
    )

    useEffect(() => {
        if (initialEmployeeResponse?.isSuccess) {
            setEmployeesResponse(getLoadedEmployees())
        }
    }, [initialEmployeeResponse?.isSuccess])

    if (role !== Role.ADMIN) {
        return <AuthErrorAlert />
    }

    return (
        <div>
            <Heading fontWeight="black" margin="1rem 0rem">
                Employees
            </Heading>
            {employeesResponse?.isLoading && <Loading />}
            {employeesResponse?.isError && (
                <ErrorAlert
                    title={employeesResponse.errorMessage}
                    message={employeesResponse.errorMessage}
                />
            )}
            {employeesResponse?.isSuccess && (
                <EmployeeTable
                    user={user}
                    employeesResponse={employeesResponse}
                    setEmployeesResponse={setEmployeesResponse}
                />
            )}
        </div>
    )
}

export default Employees
