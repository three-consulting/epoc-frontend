import React, { useContext, useState } from "react"
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
    useTasks,
    useTimesheetEntries,
    useTimesheets,
} from "@/lib/hooks/useList"
import { DateTime } from "luxon"
import { dateTimeToShortISODate } from "@/lib/utils/date"

const Report: NextPage = () => {
    const { user } = useContext(UserContext)

    const firstDay = dateTimeToShortISODate(DateTime.now().startOf("month"))
    const lastDay = dateTimeToShortISODate(DateTime.now().endOf("month"))

    const [startDate, setStartDate] = useState<string>(firstDay)
    const [endDate, setEndDate] = useState<string>(lastDay)

    const reportsResponse = useTimesheetEntries(user, startDate, endDate)
    const customersResponse = useCustomers(user)
    const projectsResponse = useProjects(user)
    const employeeResponse = useEmployees(user)
    const timesheetsResponse = useTimesheets(user)
    const tasksResponse = useTasks(user)

    const isLoading =
        reportsResponse.isLoading ||
        customersResponse.isLoading ||
        projectsResponse.isLoading ||
        employeeResponse.isLoading ||
        timesheetsResponse.isLoading ||
        tasksResponse.isLoading

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
            {tasksResponse.isError && (
                <ErrorAlert
                    title={tasksResponse.errorMessage}
                    message={tasksResponse.errorMessage}
                />
            )}
            {isLoading && <Loading />}
            {reportsResponse.isSuccess &&
                customersResponse.isSuccess &&
                projectsResponse.isSuccess &&
                employeeResponse.isSuccess &&
                timesheetsResponse.isSuccess &&
                tasksResponse.isSuccess && (
                    <ReportTable
                        entries={reportsResponse.data}
                        startDate={startDate}
                        endDate={endDate}
                        customers={customersResponse.data}
                        projects={projectsResponse.data}
                        employees={employeeResponse.data}
                        timesheets={timesheetsResponse.data}
                        tasks={tasksResponse.data}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />
                )}
        </div>
    )
}

export default Report
