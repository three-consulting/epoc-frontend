import React, { useContext } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import EmployeeTable from "@/components/table/EmployeeTable"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useEmployees } from "@/lib/hooks/useList"

const Employees: NextPage = () => {
    const { user } = useContext(UserContext)
    const employeesResponse = useEmployees(user)

    return (
        <div>
            <Heading fontWeight="black" margin="1rem 0rem">
                Employees
            </Heading>
            {employeesResponse.isLoading && <Loading />}
            {employeesResponse.isError && (
                <ErrorAlert
                    title={employeesResponse.errorMessage}
                    message={employeesResponse.errorMessage}
                />
            )}
            {employeesResponse.isSuccess && (
                <EmployeeTable employees={employeesResponse.data} />
            )}
        </div>
    )
}

export default Employees
