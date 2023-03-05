import React, { useCallback, useEffect, useState } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import EmployeeTable from "@/components/table/EmployeeTable"
import { useEmployees } from "@/lib/hooks/useList"
import { ApiGetResponse } from "@/lib/types/hooks"
import { Employee } from "@/lib/types/apiTypes"
import { Role } from "@/lib/types/auth"
import AuthErrorAlert from "@/components/common/AuthErrorAlert"
import FormPage from "@/components/common/FormPage"
import { User } from "firebase/auth"
import { FirebaseContext } from "@/lib/contexts/FirebaseAuthContext"

interface IEmployeesForm {
    user: User
    role: Role
}

const EmployeesForm = ({ user, role }: IEmployeesForm) => {
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
                    user={user}
                    employees={employeesResponse.data}
                    setEmployeesResponse={setEmployeesResponse}
                />
            )}
        </FormPage>
    )
}

const Employees: NextPage = () => (
    <FirebaseContext.Consumer>
        {({ user, role }) =>
            user && role && <EmployeesForm user={user} role={role} />
        }
    </FirebaseContext.Consumer>
)

export default Employees
