import useSWR, { useSWRConfig } from "swr"
import { Timesheet } from "../types/apiTypes"
import {
    ApiGetResponse,
    swrToApiGetResponse,
    UpdateHookArgs,
    UpdateHookFunction,
    updateToApiUpdateResponse,
} from "../types/hooks"
import { get, post, put } from "../utils/fetch"

const timesheetEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/timesheet`
const timesheetIdEndpointURL = (id: number): string => `${process.env.NEXT_PUBLIC_API_URL}/timesheet/${id}`
const timesheetIdEndpointCacheKey = (id: number): string => `/timesheet/${id}`

type UpdateTimesheets = {
    postTimesheet: UpdateHookFunction<Timesheet>
    putTimesheet: UpdateHookFunction<Timesheet>
}

export const useTimesheets = (projectId: number): ApiGetResponse<Timesheet[]> =>
    swrToApiGetResponse(
        useSWR<Timesheet[], Error>(timesheetEndpointURL, () => get(timesheetEndpointURL, { projectId: projectId }))
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
        return updateToApiUpdateResponse(newTimesheet || undefined)
    }

    const putTimesheet = async (...[timesheet, errorHandler]: UpdateHookArgs<Timesheet>) => {
        const updatedTimesheet = await put<Timesheet, Timesheet>(timesheetEndpointURL, timesheet).catch(errorHandler)
        mutate(timesheetEndpointURL)
        return updateToApiUpdateResponse(updatedTimesheet || undefined)
    }

    return { postTimesheet, putTimesheet }
}
