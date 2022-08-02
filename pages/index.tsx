import React, { useContext } from "react"
import type { NextPage } from "next"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { TimesheetEntryEditor } from "@/components/editor/TimesheetEntryEditor"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import {
    useTasks,
    useTimeCategories,
    useTimesheetEntries,
    useTimesheets,
} from "@/lib/hooks/useList"

interface IndexPageProps {
    email: string
}

const IndexPage = ({ email }: IndexPageProps) => {
    const { user } = useContext(UserContext)
    const timesheetsResponse = useTimesheets(user, undefined, email)
    const timeCategoriesResponse = useTimeCategories(user)
    const tasksResponse = useTasks(user)

    const startDate = "0000-01-01"
    const endDate = "9999-01-01"

    const timesheetEntriesResponse = useTimesheetEntries(
        user,
        startDate,
        endDate,
        email
    )

    const isLoading =
        timesheetsResponse.isLoading ||
        timeCategoriesResponse.isLoading ||
        timesheetEntriesResponse.isLoading ||
        tasksResponse.isLoading

    return (
        <>
            {timesheetsResponse.isError && (
                <ErrorAlert
                    title={timesheetsResponse.errorMessage}
                    message={timesheetsResponse.errorMessage}
                />
            )}
            {timeCategoriesResponse.isError && (
                <ErrorAlert
                    title={timeCategoriesResponse.errorMessage}
                    message={timeCategoriesResponse.errorMessage}
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
                timeCategoriesResponse.isSuccess &&
                timesheetEntriesResponse.isSuccess &&
                tasksResponse.isSuccess && (
                    <TimesheetEntryEditor
                        timesheets={timesheetsResponse.data}
                        timeCategories={timeCategoriesResponse.data}
                        entries={timesheetEntriesResponse.data}
                        tasks={tasksResponse.data}
                    />
                )}
        </>
    )
}

const Home: NextPage = () => {
    const { user } = useContext(UserContext)
    return user && user.email ? <IndexPage email={user.email} /> : null
}

export default Home
