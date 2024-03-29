import React from "react"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import EmployeeDetail from "@/components/detail/EmployeeDetail"
import { useEmployeeDetail } from "@/lib/hooks/useDetail"
import {
    useTimesheets,
    useTasks,
    useTimesheetEntries,
} from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"
import FormSection from "@/components/common/FormSection"
import { Box } from "@chakra-ui/react"
import StyledButtons from "@/components/common/StyledButtons"
import Link from "next/link"
import { StyledButton } from "@/components/common/Buttons"

type Props = {
    employeeId: number
}

function EmployeeDetailPage({ employeeId }: Props): JSX.Element {
    const employeeDetailResponse = useEmployeeDetail(employeeId)
    const tasksResponse = useTasks()
    const timesheetsResponse = useTimesheets(
        undefined,
        employeeDetailResponse.isSuccess
            ? employeeDetailResponse.data.email
            : ""
    )

    const startDate = "0000-01-01"
    const endDate = "9999-01-01"

    const timesheetEntriesResponse = useTimesheetEntries(
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
                <StyledButtons>
                    <Link key={`${employeeId}`} href={`${employeeId}/edit`}>
                        <a>
                            <StyledButton buttontype="edit" />
                        </a>
                    </Link>
                </StyledButtons>
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
