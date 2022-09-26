import React, { useCallback, useContext, useEffect, useState } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import EmployeeTable from "@/components/table/EmployeeTable"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useEmployees } from "@/lib/hooks/useList"
import { ApiGetResponse } from "@/lib/types/hooks"
import { Employee } from "@/lib/types/apiTypes"

const Employees: NextPage = () => {
    const { user } = useContext(UserContext)
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
