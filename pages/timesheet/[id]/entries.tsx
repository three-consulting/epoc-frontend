import React from "react"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import Layout from "@/components/common/Layout"
import { useTimesheetEntries } from "@/lib/hooks/useTimesheetEntries"
import { useTimesheetDetail } from "@/lib/hooks/useTimesheets"
import { TimesheetEntryEditor } from "@/components/editor/TimesheetEntryEditor"
import { useTimeCategories } from "@/lib/hooks/useTimeCategories"
import { TimeCategory, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import useTasks from "@/lib/hooks/useTasks"

type TimesheetTaskFetcherProps = {
    projectId: number
    timesheet: Timesheet
    entries: TimesheetEntry[]
    timeCategories: TimeCategory[]
}

function TimesheetTaskFetcher({
    projectId,
    timesheet,
    entries,
    timeCategories,
}: TimesheetTaskFetcherProps): JSX.Element {
    const tasksResponse = useTasks(projectId)
    return (
        <>
            {tasksResponse.isSuccess && (
                <TimesheetEntryEditor
                    tasks={tasksResponse.data}
                    timesheet={timesheet}
                    entries={entries}
                    timeCategories={timeCategories}
                />
            )}
        </>
    )
}

type TimesheetEntryEditorPageProps = {
    timesheetId: number
}

function TimesheetEntryEditorPage({
    timesheetId,
}: TimesheetEntryEditorPageProps): JSX.Element {
    const timesheetResponse = useTimesheetDetail(timesheetId)
    const timesheetEntriesResponse = useTimesheetEntries(timesheetId)
    const timeCategoriesResponse = useTimeCategories()

    return (
        <Layout>
            {timesheetEntriesResponse.isSuccess &&
                timesheetResponse.isSuccess &&
                timeCategoriesResponse.isSuccess &&
                timesheetResponse.data.project.id && (
                    <TimesheetTaskFetcher
                        projectId={timesheetResponse.data.project.id}
                        timesheet={timesheetResponse.data}
                        entries={timesheetEntriesResponse.data}
                        timeCategories={timeCategoriesResponse.data}
                    />
                )}
        </Layout>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const id = router.query.id as string | undefined
    return id ? <TimesheetEntryEditorPage timesheetId={Number(id)} /> : null
}

export default Page
