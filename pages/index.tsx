import React from "react"
import type { NextPage } from "next"
import { useEmployees } from "@/lib/hooks/useEmployees"
import { useTimesheetByEmployee } from "@/lib/hooks/useTimesheets"
import { Employee } from "@/lib/types/apiTypes"
import Layout from "@/components/common/Layout"
import { EmployeeTimesheetList } from "@/components/list/EmployeeTimesheetList"

interface EmployeeTimesheetListProps {
    id: number
    employee: Employee
}

const EmployeeTimesheetListFetcher = ({
    id,
    employee,
}: EmployeeTimesheetListProps) => {
    const timesheetResponse = useTimesheetByEmployee(id)
    return timesheetResponse.isSuccess ? (
        <EmployeeTimesheetList
            employee={employee}
            timesheets={timesheetResponse.data}
        />
    ) : null
}

const Home: NextPage = () => {
    const employeesResponse = useEmployees()
    return (
        <Layout>
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
        </Layout>
    )
}

export default Home
