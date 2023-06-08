import React, { useContext } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/dist/client/router"
import { EditTimesheetForm } from "@/components/form/TimesheetForm"
import { useTimesheetDetail } from "@/lib/hooks/useDetail"
import { useEmployees } from "@/lib/hooks/useList"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"

type Props = {
    timesheetId: number
}

function EditTimesheetPage({ timesheetId }: Props): JSX.Element {
    const router = useRouter()
    const { user } = useContext(AuthContext)

    const timesheetDetailResponse = useTimesheetDetail(timesheetId, user)
    const employeesResponse = useEmployees(user)

    const errorMessage =
        (timesheetDetailResponse.isError &&
            timesheetDetailResponse.errorMessage) ||
        (employeesResponse.isError && employeesResponse.errorMessage) ||
        ""

    const redirectToTimesheetDetail = () =>
        router.push(`/timesheet/${timesheetId}`)

    return (
        <div>
            <Heading fontWeight="black" margin="1rem 0rem">
                Edit timesheet
            </Heading>
            {(timesheetDetailResponse.isLoading ||
                employeesResponse.isLoading) && <Loading />}
            {(timesheetDetailResponse.isError || employeesResponse.isError) && (
                <ErrorAlert title={errorMessage} message={errorMessage} />
            )}
            {timesheetDetailResponse.isSuccess &&
                employeesResponse.isSuccess &&
                timesheetDetailResponse.data.id &&
                timesheetDetailResponse.data.project.id && (
                    <EditTimesheetForm
                        timesheet={timesheetDetailResponse.data}
                        timesheetId={timesheetDetailResponse.data.id}
                        project={timesheetDetailResponse.data.project}
                        projectId={timesheetDetailResponse.data.project.id}
                        employees={employeesResponse.data}
                        afterSubmit={redirectToTimesheetDetail}
                        onCancel={redirectToTimesheetDetail}
                    />
                )}
        </div>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <EditTimesheetPage timesheetId={Number(id)} /> : null
}

export default Edit
