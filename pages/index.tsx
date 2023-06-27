import React, { useContext, useState } from "react"
import type { NextPage } from "next"
import Loading from "@/components/common/Loading"
import {
    useTasks,
    useTimesheetEntries,
    useTimesheets,
} from "@/lib/hooks/useList"
import { Box } from "@chakra-ui/react"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import TimesheetEntryGrid from "@/components/TimesheetEntryGrid"
import { MediaContext } from "@/lib/contexts/MediaContext"
import { DateTime } from "luxon"
import Calendar from "@/components/common/Calendar"
import useHoliday from "@/lib/hooks/useHoliday"

const Home: NextPage = () => {
    const { email } = useContext(AuthContext)
    const { isLarge } = useContext(MediaContext)
    const [selectedDate, setSelectedDate] = useState<DateTime>(
        DateTime.fromJSDate(new Date()).startOf("week")
    )
    const holidayResponse = useHoliday()

    const startDate = "0000-01-01"
    const endDate = "9999-01-01"

    const timesheetEntriesResponse = useTimesheetEntries(
        startDate,
        endDate,
        email
    )
    const timesheetsResponse = useTimesheets(undefined, email)
    const tasksResponse = useTasks()

    const calendarProps = {
        selectedDate,
        setSelectedDate,
        holidays: holidayResponse.isSuccess ? holidayResponse.data : [],
        ...(timesheetEntriesResponse.isSuccess
            ? { entries: timesheetEntriesResponse.data }
            : {}),
    }

    return (
        <Box>
            {isLarge && <Calendar {...calendarProps} />}
            {timesheetEntriesResponse.isSuccess ? (
                <>
                    {timesheetsResponse.isSuccess &&
                        tasksResponse.isSuccess &&
                        timesheetEntriesResponse.isSuccess && (
                            <TimesheetEntryGrid
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                timesheets={timesheetsResponse.data}
                                tasks={tasksResponse.data}
                                isLarge={isLarge}
                                entries={timesheetEntriesResponse.data}
                                holidays={
                                    holidayResponse.isSuccess
                                        ? holidayResponse.data
                                        : []
                                }
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
