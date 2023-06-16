import React, { useContext, useState } from "react"
import type { NextPage } from "next"
import Loading from "@/components/common/Loading"
import {
    useTasks,
    useTimesheetEntries,
    useTimesheets,
} from "@/lib/hooks/useList"
import { Box } from "@chakra-ui/react"
import TimesheetEntryEditor from "@/components/editor/TimesheetEntryEditor"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import TimesheetEntryTable from "@/components/editor/TimesheetEntryTable"
import { MediaContext } from "@/lib/contexts/MediaContext"

const Home: NextPage = () => {
    const { email } = useContext(AuthContext)
    const { isLarge } = useContext(MediaContext)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined
    )
    const [dateUnderEdit, setDateUnderEdit] = useState<Date | undefined>(
        undefined
    )

    const startDate = "0000-01-01"
    const endDate = "9999-01-01"

    const timesheetEntriesResponse = useTimesheetEntries(
        startDate,
        endDate,
        email
    )
    const timesheetsResponse = useTimesheets(undefined, email)
    const tasksResponse = useTasks()

    return (
        <Box>
            {timesheetEntriesResponse.isSuccess ? (
                <>
                    {isLarge && (
                        <TimesheetEntryEditor
                            entries={timesheetEntriesResponse.data}
                            selectedDate={selectedDate || dateUnderEdit}
                            setSelectedDate={setSelectedDate}
                            dateUnderEdit={dateUnderEdit}
                            setDateUnderEdit={setDateUnderEdit}
                        />
                    )}
                    {timesheetsResponse.isSuccess &&
                        tasksResponse.isSuccess &&
                        timesheetEntriesResponse.isSuccess && (
                            <TimesheetEntryTable
                                selectedDate={selectedDate}
                                timesheets={timesheetsResponse.data}
                                tasks={tasksResponse.data}
                                isLarge={isLarge}
                                entries={timesheetEntriesResponse.data}
                            />
                        )}
                </>
            ) : (
                <Loading />
            )}
        </Box>
    )
}

export default Home
