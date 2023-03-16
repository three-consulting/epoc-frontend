import React, { useContext } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/router"
import { Timesheet } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useEmployees } from "@/lib/hooks/useList"
import { Box } from "@chakra-ui/react"
import FormPage from "@/components/common/FormPage"
import { CreateTimesheetForm } from "@/components/form/TimesheetForm"

const New: NextPage = () => {
    const router = useRouter()
    const { user } = useContext(UserContext)
    const employeesResponse = useEmployees(user)

    const errorMessage =
        (employeesResponse.isError && employeesResponse.errorMessage) || ""

    const redirectToTimesheetList = () => router.push("/timesheet")
    const redirectToTimesheetDetails = (
        createTimesheetResponse: ApiUpdateResponse<Timesheet>
    ) =>
        createTimesheetResponse.isSuccess &&
        createTimesheetResponse.data.id &&
        router.push(`/timesheet/${createTimesheetResponse.data.id}`)

    return (
        <FormPage header="Timesheets">
            <Box>
                {employeesResponse.isLoading && <Loading />}
                {employeesResponse.isError && (
                    <ErrorAlert title={errorMessage} message={errorMessage} />
                )}
                {employeesResponse.isSuccess && (
                    <CreateTimesheetForm
                        employees={employeesResponse.data}
                        afterSubmit={redirectToTimesheetDetails}
                        onCancel={redirectToTimesheetList}
                    />
                )}
            </Box>
        </FormPage>
    )
}

export default New
