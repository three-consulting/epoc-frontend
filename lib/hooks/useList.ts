import {
    Customer,
    Employee,
    Project,
    Task,
    Timesheet,
    TimesheetEntry,
} from "../types/apiTypes"
import { ApiGetResponse } from "../types/hooks"
import { useUser } from "./misc"
import { useGet, listEndpoint } from "./swrInterface"

export const useCustomers = (): ApiGetResponse<Customer[]> =>
    useGet(listEndpoint("customer"), ["customer"], useUser())

export const useProjects = (): ApiGetResponse<Project[]> =>
    useGet(listEndpoint("project"), ["project"], useUser())

export const useEmployees = (): ApiGetResponse<Employee[]> =>
    useGet(listEndpoint("employee"), ["employee"], useUser())

export const useTasks = (projectId?: number): ApiGetResponse<Task[]> =>
    useGet(listEndpoint("task"), ["task"], useUser(), { projectId })

export const useTimesheets = (
    projectId?: number,
    email?: string
): ApiGetResponse<Timesheet[]> =>
    useGet(listEndpoint("timesheet"), ["timesheet"], useUser(), {
        projectId,
        email,
    })

export const useTimesheetEntries = (
    startDate: string,
    endDate: string,
    email?: string,
    timesheetId?: number
): ApiGetResponse<TimesheetEntry[]> =>
    useGet(listEndpoint("timesheet-entry"), ["timesheet-entry"], useUser(), {
        startDate,
        endDate,
        email,
        timesheetId,
    })
