import useSWR, { useSWRConfig } from "swr"
import { NEXT_PUBLIC_API_URL } from "../conf"
import { TimesheetEntry } from "../types/apiTypes"
import {
    ApiGetResponse,
    swrToApiGetResponse,
    UpdateHookArgs,
    UpdateHookFunction,
    updateToApiUpdateResponse,
} from "../types/hooks"
import { get, post, put, del } from "../utils/fetch"

const timesheetEntryEndpointURL = `${NEXT_PUBLIC_API_URL}/timesheet-entry`
const timesheetIdEntryEndpointURL = (id: number) =>
    `${NEXT_PUBLIC_API_URL}/timesheet-entry/${id}`

type UpdateTimesheetEntries = {
    postTimesheetEntry: UpdateHookFunction<TimesheetEntry>
    putTimesheetEntry: UpdateHookFunction<TimesheetEntry>
    deleteTimesheetEntry: (entryId: number) => void
}

export const useTimesheetEntries = (
    timesheetId: number
): ApiGetResponse<TimesheetEntry[]> =>
    swrToApiGetResponse(
        useSWR<TimesheetEntry[], Error>(timesheetEntryEndpointURL, () =>
            get(timesheetEntryEndpointURL, { timesheetId })
        )
    )

export const useUpdateTimesheetEntries = (): UpdateTimesheetEntries => {
    const { mutate } = useSWRConfig()

    const postTimesheetEntry = async (
        ...[task, errorHandler]: UpdateHookArgs<TimesheetEntry>
    ) => {
        const newTask = await post<TimesheetEntry, TimesheetEntry>(
            timesheetEntryEndpointURL,
            task
        ).catch(errorHandler)
        mutate(timesheetEntryEndpointURL)

        return updateToApiUpdateResponse(newTask || null)
    }

    const putTimesheetEntry = async (
        ...[task, errorHandler]: UpdateHookArgs<TimesheetEntry>
    ) => {
        const updatedTask = await put<TimesheetEntry, TimesheetEntry>(
            timesheetEntryEndpointURL,
            task
        ).catch(errorHandler)
        mutate(timesheetEntryEndpointURL)

        return updateToApiUpdateResponse(updatedTask || null)
    }

    const deleteTimesheetEntry = async (entryId: number) => {
        await del<TimesheetEntry>(timesheetIdEntryEndpointURL(entryId))
        mutate(timesheetEntryEndpointURL)
    }

    return { postTimesheetEntry, putTimesheetEntry, deleteTimesheetEntry }
}
