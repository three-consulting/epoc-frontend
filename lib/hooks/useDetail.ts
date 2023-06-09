import { useContext } from "react"
import { AuthContext } from "../contexts/FirebaseAuthContext"
import { Customer, Project, Timesheet, Employee } from "../types/apiTypes"
import { ApiGetResponse } from "../types/hooks"
import { detailEndpoint, useGet } from "./swrInterface"

export const useCustomerDetail = (id: number): ApiGetResponse<Customer> => {
    const { user } = useContext(AuthContext)
    return useGet(detailEndpoint("customer", id), ["customer"], user)
}

export const useProjectDetail = (id: number): ApiGetResponse<Project> => {
    const { user } = useContext(AuthContext)
    return useGet(detailEndpoint("project", id), ["project"], user)
}

export const useTimesheetDetail = (id: number): ApiGetResponse<Timesheet> => {
    const { user } = useContext(AuthContext)
    return useGet(detailEndpoint("timesheet", id), ["timesheet"], user)
}

export const useEmployeeDetail = (id: number): ApiGetResponse<Employee> => {
    const { user } = useContext(AuthContext)
    return useGet(detailEndpoint("employee", id), ["employee"], user)
}
