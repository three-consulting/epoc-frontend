import React, { useContext } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import { useTimeIntervalTimesheetEntries } from "@/lib/hooks/useTimesheetEntries"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import ReportTable from "@/components/table/ReportTable"

const Report: NextPage = () => {
    const { user } = useContext(UserContext)
    const startDate = "2022-01-01"
    const endDate = "2022-12-12"
    const reportsResponse = useTimeIntervalTimesheetEntries(
        user,
        startDate,
        endDate
    )

    return (
        <div>
            {reportsResponse.isSuccess && (
                <Heading fontWeight="black" margin="1rem 0rem">
                    Reports
                </Heading>
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
