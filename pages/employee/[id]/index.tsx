import React, { useContext } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import EmployeeDetail from "@/components/detail/EmployeeDetail"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useEmployeeDetail } from "@/lib/hooks/useDetail"
import {
    useTimesheets,
    useTasks,
    useTimesheetEntries,
} from "@/lib/hooks/useList"
import { User } from "firebase/auth"

interface IEmployeeDetailPage {
    employeeId: number
    user: User
}

function EmployeeDetailPage({
    employeeId,
    user,
}: IEmployeeDetailPage): JSX.Element {
    const employeeDetailResponse = useEmployeeDetail(employeeId, user)
    const tasksResponse = useTasks(user)
    const timesheetsResponse = useTimesheets(
        user,
        undefined,
        employeeDetailResponse.isSuccess
            ? employeeDetailResponse.data.email
            : ""
    )

    const startDate = "0000-01-01"
    const endDate = "9999-01-01"

    const timesheetEntriesResponse = useTimesheetEntries(
        user,
        startDate,
        endDate,
        employeeDetailResponse.isSuccess
            ? employeeDetailResponse.data.email
            : ""
    )

    const isLoading =
        employeeDetailResponse.isLoading ||
        timesheetsResponse.isLoading ||
        tasksResponse.isLoading ||
        timesheetEntriesResponse.isLoading

    const isError =
        employeeDetailResponse.isError ||
        timesheetsResponse.isError ||
        tasksResponse.isError ||
        timesheetEntriesResponse.isError

    const isSuccess =
        employeeDetailResponse.isSuccess &&
        timesheetsResponse.isSuccess &&
        tasksResponse.isSuccess &&
        timesheetEntriesResponse.isSuccess

    return (
        <div>
            {isError && <ErrorAlert title="Error" message="Error" />}
            {isLoading && <Loading />}
            {isSuccess && (
                <EmployeeDetail
                    employee={employeeDetailResponse.data}
                    employeeId={employeeId}
                    entries={timesheetEntriesResponse.data}
                    timesheets={timesheetsResponse.data}
                    tasks={tasksResponse.data}
                    user={user}
                />
            )}
        </div>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    const { user } = useContext(UserContext)
    return id ? (
        <EmployeeDetailPage employeeId={Number(id)} user={user} />
    ) : null
}

export default Page
