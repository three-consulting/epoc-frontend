import useSWR, { useSWRConfig } from "swr"
import { NEXT_PUBLIC_API_URL } from "../conf"
import { Timesheet } from "../types/apiTypes"
import {
    ApiGetResponse,
    swrToApiGetResponse,
    UpdateHookArgs,
    UpdateHookFunction,
    updateToApiUpdateResponse,
} from "../types/hooks"
import { get, post, put } from "../utils/fetch"

const timesheetEndpointURL = `${NEXT_PUBLIC_API_URL}/timesheet`
const timesheetIdEndpointURL = (id: number): string => `${NEXT_PUBLIC_API_URL}/timesheet/${id}`
const timesheetIdEndpointCacheKey = (id: number): string => `/timesheet/${id}`

type UpdateTimesheets = {
    postTimesheet: UpdateHookFunction<Timesheet>
    putTimesheet: UpdateHookFunction<Timesheet>
}

export const useTimesheets = (projectId: number): ApiGetResponse<Timesheet[]> =>
    swrToApiGetResponse(
        useSWR<Timesheet[], Error>(timesheetEndpointURL, () => get(timesheetEndpointURL, { projectId }))
    )

export const useTimesheetDetail = (id: number): ApiGetResponse<Timesheet> =>
    swrToApiGetResponse(
        useSWR<Timesheet, Error>(timesheetIdEndpointCacheKey(id), () => get(timesheetIdEndpointURL(id)))
    )

export const useUpdateTimesheets = (): UpdateTimesheets => {
    const { mutate } = useSWRConfig()

    const postTimesheet = async (...[timesheet, errorHandler]: UpdateHookArgs<Timesheet>) => {
        const newTimesheet = await post<Timesheet, Timesheet>(timesheetEndpointURL, timesheet).catch(errorHandler)
        mutate(timesheetEndpointURL)

        return updateToApiUpdateResponse(newTimesheet || null)
    }

    const putTimesheet = async (...[timesheet, errorHandler]: UpdateHookArgs<Timesheet>) => {
        const updatedTimesheet = await put<Timesheet, Timesheet>(timesheetEndpointURL, timesheet).catch(errorHandler)
        mutate(timesheetEndpointURL)

        return updateToApiUpdateResponse(updatedTimesheet || null)
    }

    return { postTimesheet, putTimesheet }
}
