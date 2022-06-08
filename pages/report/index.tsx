import React, { useContext } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import ReportTable from "@/components/table/ReportTable"
import Loading from "@/components/common/Loading"
import ErrorAlert from "@/components/common/ErrorAlert"
import {
    useCustomers,
    useEmployees,
    useProjects,
    useTimesheetEntries,
    useTimesheets,
} from "@/lib/hooks/useList"

const Report: NextPage = () => {
    const { user } = useContext(UserContext)

    const startDate = "2022-01-01"
    const endDate = "2022-12-12"

    const reportsResponse = useTimesheetEntries(user, startDate, endDate)
    const customersResponse = useCustomers(user)
    const projectsResponse = useProjects(user)
    const employeeResponse = useEmployees(user)
    const timesheetsResponse = useTimesheets(user)

    const isLoading =
        reportsResponse.isLoading ||
        customersResponse.isLoading ||
        projectsResponse.isLoading ||
        employeeResponse.isLoading ||
        timesheetsResponse.isLoading

    return (
        <div>
            <Heading fontWeight="black" margin="1rem 0rem">
                Reports
            </Heading>
            {reportsResponse.isError && (
                <ErrorAlert
                    title={reportsResponse.errorMessage}
                    message={reportsResponse.errorMessage}
                />
            )}
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
            {isLoading && <Loading />}
            {reportsResponse.isSuccess &&
                customersResponse.isSuccess &&
                projectsResponse.isSuccess &&
                employeeResponse.isSuccess &&
                timesheetsResponse.isSuccess && (
                    <ReportTable
                        entries={reportsResponse.data}
                        startDate={startDate}
                        endDate={endDate}
                        customers={customersResponse.data}
                        projects={projectsResponse.data}
                        employees={employeeResponse.data}
                        timesheets={timesheetsResponse.data}
                    />
                )}
        </div>
    )
}

export default Report
