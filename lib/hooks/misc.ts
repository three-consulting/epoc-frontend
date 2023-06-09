import { useContext } from "react"
import { AuthContext } from "../contexts/FirebaseAuthContext"
import { Employee } from "../types/apiTypes"
import {
    Endpoint,
    firebaseSyncEndpoint,
    listEndpoint,
    useGet,
} from "./swrInterface"

export const useEmployeeSync = (shouldSync: boolean) => {
    const { user } = useContext(AuthContext)
    return useGet<Employee[]>(
        shouldSync ? firebaseSyncEndpoint("employee-sync") : null,
        [],
        user
    )
}

export const useFlex = () => {
    const { user, email } = useContext(AuthContext)
    return useGet<number>(
        listEndpoint("timesheet-entry/flex" as Endpoint),
        ["timesheet-entry"],
        user,
        { email }
    )
}
