import React, { useContext } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useTimesheets } from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"
import TimesheetTable from "@/components/table/TimesheetTable"

const Timesheets: NextPage = () => {
    const { user } = useContext(UserContext)
    const timesheetsResponse = useTimesheets(user)

    return (
        <FormPage header="Timesheets">
            {timesheetsResponse.isLoading && <Loading />}
            {timesheetsResponse.isError && (
                <ErrorAlert
                    title={timesheetsResponse.errorMessage}
                    message={timesheetsResponse.errorMessage}
                />
            )}
            {timesheetsResponse.isSuccess && (
                <TimesheetTable timesheets={timesheetsResponse.data} />
            )}
        </FormPage>
    )
}

export default Timesheets
