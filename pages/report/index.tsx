import React, { useContext } from "react"
import type { NextPage } from "next"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import Loading from "@/components/common/Loading"
import ErrorAlert from "@/components/common/ErrorAlert"
import {
    useCustomers,
    useEmployees,
    useProjects,
    useTasks,
    useTimesheets,
} from "@/lib/hooks/useList"
import AuthErrorAlert from "@/components/common/AuthErrorAlert"
import { Role } from "@/lib/types/auth"
import FormPage from "@/components/common/FormPage"
import ReportTable from "@/components/table/ReportTable"

const Report: NextPage = () => {
    const { user, role } = useContext(AuthContext)

    const customersResponse = useCustomers(user)
    const projectsResponse = useProjects(user)
    const employeeResponse = useEmployees(user)
    const timesheetsResponse = useTimesheets(user)
    const tasksResponse = useTasks(user)

    const isLoading =
        customersResponse.isLoading ||
        projectsResponse.isLoading ||
        employeeResponse.isLoading ||
        timesheetsResponse.isLoading ||
        tasksResponse.isLoading

    if (role !== Role.ADMIN) {
        return <AuthErrorAlert />
    }

    return (
        <FormPage header="Reports">
            {customersResponse.isError && (
                <ErrorAlert
                    title={customersResponse.errorMessage}
                    message={customersResponse.errorMessage}
                />
            )}
            {projectsResponse.isError && (
                <ErrorAlert
                    title={projectsResponse.errorMessage}
                    message={projectsResponse.errorMessage}
                />
            )}
            {employeeResponse.isError && (
                <ErrorAlert
                    title={employeeResponse.errorMessage}
                    message={employeeResponse.errorMessage}
                />
            )}
            {timesheetsResponse.isError && (
                <ErrorAlert
                    title={timesheetsResponse.errorMessage}
                    message={timesheetsResponse.errorMessage}
                />
            )}
            {tasksResponse.isError && (
                <ErrorAlert
                    title={tasksResponse.errorMessage}
                    message={tasksResponse.errorMessage}
                />
            )}
            {isLoading && <Loading />}
            {customersResponse.isSuccess &&
                projectsResponse.isSuccess &&
                employeeResponse.isSuccess &&
                timesheetsResponse.isSuccess &&
                tasksResponse.isSuccess && (
                    <ReportTable
                        customers={customersResponse.data}
                        projects={projectsResponse.data}
                        employees={employeeResponse.data}
                        timesheets={timesheetsResponse.data}
                        tasks={tasksResponse.data}
                        user={user}
                    />
                )}
        </FormPage>
    )
}

export default Report
