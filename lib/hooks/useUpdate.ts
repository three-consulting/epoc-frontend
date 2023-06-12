import {
    Customer,
    Employee,
    Project,
    Task,
    Timesheet,
    TimesheetEntry,
} from "../types/apiTypes"
import { UpdateHook } from "../types/hooks"
import { useUpdate } from "./swrInterface"
import { useUser } from "./misc"

export const useUpdateCustomers = (): UpdateHook<Customer> =>
    useUpdate("customer", useUser())

export const useUpdateProjects = (): UpdateHook<Project> =>
    useUpdate("project", useUser())

export const useUpdateTasks = (): UpdateHook<Task> =>
    useUpdate("task", useUser())

export const useUpdateTimesheets = (): UpdateHook<Timesheet> =>
    useUpdate("timesheet", useUser())

export const useUpdateTimesheetEntry = (): UpdateHook<TimesheetEntry> =>
    useUpdate("timesheet-entry", useUser())

export const useUpdateTimesheetEntries = (): UpdateHook<TimesheetEntry[]> =>
    useUpdate("timesheet-entry", useUser())

export const useUpdateEmployees = (): UpdateHook<Employee> =>
    useUpdate("employee", useUser())
