import React, { useContext } from "react"
import type { NextPage } from "next"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useEmployeeTimesheets } from "@/lib/hooks/useTimesheets"
import { TimesheetEntryEditor } from "@/components/editor/TimesheetEntryEditor"
import { useTimeCategories } from "@/lib/hooks/useTimeCategories"
import { Timesheet } from "@/lib/types/apiTypes"
import { useEmployeeTimesheetEntries } from "@/lib/hooks/useTimesheetEntries"

type TimesheetEntryEditorPageProps = {
    timesheets: Timesheet[]
}

function TimesheetEntryEditorPage({
    timesheets,
}: TimesheetEntryEditorPageProps): JSX.Element {
    const { user } = useContext(UserContext)
    const timesheetEntriesResponse = useEmployeeTimesheetEntries(user)
    const timeCategoriesResponse = useTimeCategories(user)

    return (
        <div>
            {timesheetEntriesResponse.isSuccess &&
                timeCategoriesResponse.isSuccess && (
                    <TimesheetEntryEditor
                        timesheets={timesheets}
                        entries={timesheetEntriesResponse.data}
                        timeCategories={timeCategoriesResponse.data}
                    />
                )}
        </div>
    )
}

const Home: NextPage = () => {
    const { user } = useContext(UserContext)
    const timesheets = useEmployeeTimesheets(user)
    return timesheets.isSuccess ? (
        <TimesheetEntryEditorPage timesheets={timesheets.data} />
    ) : null
}

export default Home
