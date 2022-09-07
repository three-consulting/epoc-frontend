import { User } from "firebase/auth"
import { Customer, Project, Timesheet, Employee } from "../types/apiTypes"
import { ApiGetResponse } from "../types/hooks"
import { useGet, detailEndpoint } from "./swrInterface"

export const useCustomerDetail = (
    id: number,
    user: User
): ApiGetResponse<Customer> => useGet(user, detailEndpoint("customer", id))

export const useProjectDetail = (
    id: number,
    user: User
): ApiGetResponse<Project> => useGet(user, detailEndpoint("project", id))

export const useTimesheetDetail = (
    id: number,
    user: User
): ApiGetResponse<Timesheet> => useGet(user, detailEndpoint("timesheet", id))

export const useEmployeeDetail = (
    id: number,
    user: User
): ApiGetResponse<Employee> => useGet(user, detailEndpoint("employee", id))
