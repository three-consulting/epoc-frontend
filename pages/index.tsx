import React, { useContext } from "react"
import type { NextPage } from "next"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { TimesheetEntryEditor } from "@/components/editor/TimesheetEntryEditor"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import {
    useTasks,
    useTimesheetEntries,
    useTimesheets,
} from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"
import { Box } from "@chakra-ui/react"
import { User } from "firebase/auth"

interface IIndexPageProps {
    email: string
    user: User
}

const IndexPage = ({ email, user }: IIndexPageProps) => {
    const timesheetsResponse = useTimesheets(user, undefined, email)
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
                            user={user}
                        />
                    )}
            </Box>
        </FormPage>
    )
}

const Home: NextPage = () => {
    const { user } = useContext(UserContext)
    return user && user.email ? (
        <IndexPage email={user.email} user={user} />
    ) : null
}

export default Home
