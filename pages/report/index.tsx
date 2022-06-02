import React, { useContext } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import ReportTable from "@/components/table/ReportTable"
import Loading from "@/components/common/Loading"
import ErrorAlert from "@/components/common/ErrorAlert"
import { useTimesheetEntries } from "@/lib/hooks/useList"

const Report: NextPage = () => {
    const { user } = useContext(UserContext)
    const startDate = "2022-01-01"
    const endDate = "2022-12-12"
    const reportsResponse = useTimesheetEntries(user, startDate, endDate)

    return (
        <div>
            <Heading fontWeight="black" margin="1rem 0rem">
                Reports
            </Heading>
            {reportsResponse.isLoading && <Loading />}
            {reportsResponse.isError && (
                <ErrorAlert
                    title={reportsResponse.errorMessage}
                    message={reportsResponse.errorMessage}
                />
            )}
            {reportsResponse.isSuccess && (
                <ReportTable
                    entries={reportsResponse.data}
                    startDate={startDate}
                    endDate={endDate}
                />
            )}
        </div>
    )
}

export default Report
