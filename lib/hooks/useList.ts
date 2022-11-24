import { User } from "firebase/auth"
import {
    Customer,
    Employee,
    Project,
    Task,
    Timesheet,
    TimesheetEntry,
} from "../types/apiTypes"
import { ApiGetResponse } from "../types/hooks"
import { useGet, listEndpoint } from "./swrInterface"

const pushOptionalFields = (
    record: Record<string, string | number>,
    optionalFields: Record<string, string | number | undefined>
): Record<string, string | number> => {
    const keys = Object.keys(optionalFields)
    for (const key of keys) {
        const value = optionalFields[key]
        if (value) {
            record[key] = value
        }
    }
    return record
}

export const useCustomers = (user: User): ApiGetResponse<Customer[]> =>
    useGet(user, listEndpoint("customer"))

export const useProjects = (user: User): ApiGetResponse<Project[]> =>
    useGet(user, listEndpoint("project"))

export const useEmployees = (user: User): ApiGetResponse<Employee[]> =>
    useGet(user, listEndpoint("employee"))

export const useTasks = (
    user: User,
    projectId?: number
): ApiGetResponse<Task[]> =>
    useGet(user, listEndpoint("task"), pushOptionalFields({}, { projectId }))

export const useTimesheets = (
    user: User,
    projectId?: number,
    email?: string
): ApiGetResponse<Timesheet[]> =>
    useGet(
        user,
        listEndpoint("timesheet"),
        pushOptionalFields({}, { projectId, email })
    )

export const useTimesheetEntries = (
    user: User,
    startDate: string,
    endDate: string,
    email?: string,
    timesheetId?: number
): ApiGetResponse<TimesheetEntry[]> =>
    useGet(
        user,
        listEndpoint("timesheet-entry"),
        pushOptionalFields(
            {
                startDate,
                endDate,
            },
            { email, timesheetId }
        )
    )
