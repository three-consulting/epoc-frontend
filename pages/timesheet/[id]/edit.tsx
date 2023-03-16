import React, { useContext } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/dist/client/router"
import { EditTimesheetForm } from "@/components/form/TimesheetForm"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useTimesheetDetail } from "@/lib/hooks/useDetail"
import { useEmployees } from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"
import { Box } from "@chakra-ui/react"

interface IEditTimesheetPage {
    timesheetId: number
}

const EditTimesheetPage = ({
    timesheetId,
}: IEditTimesheetPage): JSX.Element => {
    const router = useRouter()
    const { user } = useContext(UserContext)

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
        <FormPage header="Timesheets">
            <Box>
                {(timesheetDetailResponse.isLoading ||
                    employeesResponse.isLoading) && <Loading />}
                {(timesheetDetailResponse.isError ||
                    employeesResponse.isError) && (
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
            </Box>
        </FormPage>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <EditTimesheetPage timesheetId={Number(id)} /> : null
}

export default Edit
