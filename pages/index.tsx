import React, { useContext } from "react"
import type { NextPage } from "next"
import { useEmployees } from "@/lib/hooks/useEmployees"
import { useTimesheetByEmployee } from "@/lib/hooks/useTimesheets"
import { Employee } from "@/lib/types/apiTypes"
import { EmployeeTimesheetList } from "@/components/list/EmployeeTimesheetList"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"

interface EmployeeTimesheetListProps {
    id: number
    employee: Employee
}

const EmployeeTimesheetListFetcher = ({
    id,
    employee,
}: EmployeeTimesheetListProps) => {
    const { user } = useContext(UserContext)
    const timesheetResponse = useTimesheetByEmployee(id, user)
    return timesheetResponse.isSuccess ? (
        <EmployeeTimesheetList
            employee={employee}
            timesheets={timesheetResponse.data}
        />
    ) : null
}

const Home: NextPage = () => {
    const { user } = useContext(UserContext)
    const employeesResponse = useEmployees(user)
    return (
        <div>
            {employeesResponse.isSuccess &&
                employeesResponse.data.map(
                    (employee) =>
                        employee.id && (
                            <EmployeeTimesheetListFetcher
                                key={employee.id}
                                id={employee.id}
                                employee={employee}
                            />
                        )
                )}
        </div>
    )
}

export default Home
