import { Customer, Project, Timesheet, Employee } from "../types/apiTypes"
import { ApiGetResponse } from "../types/hooks"
import { useUser } from "./misc"
import { detailEndpoint, useGet } from "./swrInterface"

export const useCustomerDetail = (id: number): ApiGetResponse<Customer> =>
    useGet(detailEndpoint("customer", id), ["customer"], useUser())

export const useProjectDetail = (id: number): ApiGetResponse<Project> =>
    useGet(detailEndpoint("project", id), ["project"], useUser())

export const useTimesheetDetail = (id: number): ApiGetResponse<Timesheet> =>
    useGet(detailEndpoint("timesheet", id), ["timesheet"], useUser())

export const useEmployeeDetail = (id: number): ApiGetResponse<Employee> =>
    useGet(detailEndpoint("employee", id), ["employee"], useUser())
