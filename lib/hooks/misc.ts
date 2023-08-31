import { useContext } from "react"
import { AuthContext } from "../contexts/FirebaseAuthContext"
import { Endpoint, listEndpoint, useGet } from "./swrInterface"

export const useUser = () => useContext(AuthContext).user

export const useFlex = () => {
    const { user, email } = useContext(AuthContext)
    return useGet<number>(
        listEndpoint("timesheet-entry/flex" as Endpoint),
        ["timesheet-entry"],
        user,
        { email }
    )
}
