import React, { useContext } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import {
    useTasks,
    useTimesheetEntries,
    useTimesheets,
} from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"
import { Box } from "@chakra-ui/react"
import TimesheetEntryEditor from "@/components/editor/TimesheetEntryEditor"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"

const Home: NextPage = () => {
    const { email } = useContext(AuthContext)
    const timesheetsResponse = useTimesheets(undefined, email)
    const tasksResponse = useTasks()

    const startDate = "0000-01-01"
    const endDate = "9999-01-01"

    const timesheetEntriesResponse = useTimesheetEntries(
        startDate,
        endDate,
        email
    )

    const isLoading =
        timesheetsResponse.isLoading ||
        timesheetEntriesResponse.isLoading ||
        tasksResponse.isLoading

    return (
        <FormPage header="Home">
            <Box>
                {timesheetsResponse.isError && (
                    <ErrorAlert
                        title={timesheetsResponse.errorMessage}
                        message={timesheetsResponse.errorMessage}
                    />
                )}
                {timesheetEntriesResponse.isError && (
                    <ErrorAlert
                        title={timesheetEntriesResponse.errorMessage}
                        message={timesheetEntriesResponse.errorMessage}
                    />
                )}
                {tasksResponse.isError && (
                    <ErrorAlert
                        title={tasksResponse.errorMessage}
                        message={tasksResponse.errorMessage}
                    />
                )}
                {isLoading && <Loading />}
                {timesheetsResponse.isSuccess &&
                    timesheetEntriesResponse.isSuccess &&
                    tasksResponse.isSuccess && (
                        <TimesheetEntryEditor
                            timesheets={timesheetsResponse.data}
                            entries={timesheetEntriesResponse.data}
                            tasks={tasksResponse.data}
                        />
                    )}
            </Box>
        </FormPage>
    )
}

export default Home
