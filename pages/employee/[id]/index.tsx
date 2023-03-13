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
import FormPage from "@/components/common/FormPage"
import FormSection from "@/components/common/FormSection"
import { Box } from "@chakra-ui/react"
import FormButtons from "@/components/common/FormButtons"
import Link from "next/link"
import { StyledButton } from "@/components/common/Buttons"

type Props = {
    employeeId: number
}

function EmployeeDetailPage({ employeeId }: Props): JSX.Element {
    const { user } = useContext(UserContext)
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

    const getHeader = () =>
        employeeDetailResponse.isSuccess
            ? `${employeeDetailResponse.data.firstName ?? " - "} ${
                  employeeDetailResponse.data.lastName ?? " - "
              }`
            : " - "

    return (
        <FormPage header="Employees">
            {isError && <ErrorAlert title="Error" message="Error" />}
            {isLoading && <Loading />}
            <FormSection header={getHeader()}>
                {isSuccess ? (
                    <EmployeeDetail
                        employee={employeeDetailResponse.data}
                        employeeId={employeeId}
                        entries={timesheetEntriesResponse.data}
                        timesheets={timesheetsResponse.data}
                        tasks={tasksResponse.data}
                    />
                ) : (
                    <Box>{"Not found"}</Box>
                )}
                <FormButtons>
                    <Link key={`${employeeId}`} href={`${employeeId}/edit`}>
                        <StyledButton buttontype="edit" />
                    </Link>
                </FormButtons>
            </FormSection>
        </FormPage>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <EmployeeDetailPage employeeId={Number(id)} /> : null
}

export default Page
