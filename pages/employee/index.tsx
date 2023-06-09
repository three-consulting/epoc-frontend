import React, { useCallback, useContext, useEffect, useState } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import EmployeeTable from "@/components/table/EmployeeTable"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import { useEmployees } from "@/lib/hooks/useList"
import { ApiGetResponse } from "@/lib/types/hooks"
import { Employee } from "@/lib/types/apiTypes"
import { Role } from "@/lib/types/auth"
import AuthErrorAlert from "@/components/common/AuthErrorAlert"
import FormPage from "@/components/common/FormPage"

const Employees: NextPage = () => {
    const { role } = useContext(AuthContext)
    const initialEmployeeResponse = useEmployees()

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
        <FormPage header="Employees">
            {employeesResponse?.isLoading && <Loading />}
            {employeesResponse?.isError && (
                <ErrorAlert
                    title={employeesResponse.errorMessage}
                    message={employeesResponse.errorMessage}
                />
            )}
            {employeesResponse?.isSuccess && (
                <EmployeeTable
                    employeesResponse={employeesResponse}
                    setEmployeesResponse={setEmployeesResponse}
                />
            )}
        </FormPage>
    )
}

export default Employees
