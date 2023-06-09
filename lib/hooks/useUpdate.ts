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
import { useContext } from "react"
import { AuthContext } from "../contexts/FirebaseAuthContext"

export const useUpdateCustomers = (): UpdateHook<Customer> => {
    const { user } = useContext(AuthContext)
    return useUpdate("customer", user)
}

export const useUpdateProjects = (): UpdateHook<Project> => {
    const { user } = useContext(AuthContext)
    return useUpdate("project", user)
}

export const useUpdateTasks = (): UpdateHook<Task> => {
    const { user } = useContext(AuthContext)
    return useUpdate("task", user)
}

export const useUpdateTimesheets = (): UpdateHook<Timesheet> => {
    const { user } = useContext(AuthContext)
    return useUpdate("timesheet", user)
}

export const useUpdateTimesheetEntry = (): UpdateHook<TimesheetEntry> => {
    const { user } = useContext(AuthContext)
    return useUpdate("timesheet-entry", user)
}

export const useUpdateTimesheetEntries = (): UpdateHook<TimesheetEntry[]> => {
    const { user } = useContext(AuthContext)
    return useUpdate("timesheet-entry", user)
}

export const useUpdateEmployees = (): UpdateHook<Employee> => {
    const { user } = useContext(AuthContext)
    return useUpdate("employee", user)
}
