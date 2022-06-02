import {
    Customer,
    Project,
    Task,
    Timesheet,
    TimesheetEntry,
} from "../types/apiTypes"
import { UpdateHook } from "../types/hooks"
import { User } from "firebase/auth"
import { useUpdate } from "./swrInterface"

export const useUpdateCustomers = (user: User): UpdateHook<Customer> =>
    useUpdate("customer", user)

export const useUpdateProjects = (user: User): UpdateHook<Project> =>
    useUpdate("project", user)

export const useUpdateTasks = (user: User): UpdateHook<Task> =>
    useUpdate("task", user)

export const useUpdateTimesheets = (user: User): UpdateHook<Timesheet> =>
    useUpdate("timesheet", user)

export const useUpdateTimesheetEntries = (
    user: User
): UpdateHook<TimesheetEntry> => useUpdate("timesheet-entry", user)
