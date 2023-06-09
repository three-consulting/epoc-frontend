import { User } from "firebase/auth"
import { useContext } from "react"
import { AuthContext } from "../contexts/FirebaseAuthContext"
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

export const useCustomers = (): ApiGetResponse<Customer[]> => {
    const { user } = useContext(AuthContext)
    return useGet(listEndpoint("customer"), ["customer"], user)
}

export const useProjects = (): ApiGetResponse<Project[]> => {
    const { user } = useContext(AuthContext)
    return useGet(listEndpoint("project"), ["project"], user)
}

export const useEmployees = (): ApiGetResponse<Employee[]> => {
    const { user } = useContext(AuthContext)
    return useGet(listEndpoint("employee"), ["employee"], user)
}

export const useTasks = (projectId?: number): ApiGetResponse<Task[]> => {
    const { user } = useContext(AuthContext)
    return useGet(
        listEndpoint("task"),
        ["task"],
        user,
        pushOptionalFields({}, { projectId })
    )
}

export const useTimesheets = (
    projectId?: number,
    email?: string
): ApiGetResponse<Timesheet[]> => {
    const { user } = useContext(AuthContext)
    return useGet(
        listEndpoint("timesheet"),
        ["timesheet"],
        user,
        pushOptionalFields({}, { projectId, email })
    )
}

export const useTimesheetEntries = (
    startDate: string,
    endDate: string,
    email?: string,
    timesheetId?: number
): ApiGetResponse<TimesheetEntry[]> => {
    const { user } = useContext(AuthContext)
    return useGet(
        listEndpoint("timesheet-entry"),
        ["timesheet-entry"],
        user,
        pushOptionalFields(
            {
                startDate,
                endDate,
            },
            { email, timesheetId }
        )
    )
}
