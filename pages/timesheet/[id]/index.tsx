import React from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import TimesheetDetail from "@/components/detail/TimesheetDetail"
import Link from "next/link"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useTimesheetDetail } from "@/lib/hooks/useDetail"
import { StyledButton } from "@/components/common/Buttons"
import FormButtons from "@/components/common/FormButtons"
import FormSection from "@/components/common/FormSection"
import FormPage from "@/components/common/FormPage"
import { User } from "firebase/auth"

interface ITimesheetDetailPage {
    timesheetId: number
    user: User
}

const TimesheetDetailPage = ({
    timesheetId,
    user,
}: ITimesheetDetailPage): JSX.Element => {
    const timesheetDetailResponse = useTimesheetDetail(timesheetId, user)

    return (
        <FormPage header="moi">
            {timesheetDetailResponse.isLoading && <Loading />}
            {timesheetDetailResponse.isError && (
                <ErrorAlert
                    title={timesheetDetailResponse.errorMessage}
                    message={timesheetDetailResponse.errorMessage}
                />
            )}
            {timesheetDetailResponse.isSuccess ? (
                <FormSection header="-">
                    <TimesheetDetail timesheet={timesheetDetailResponse.data} />
                    <FormButtons>
                        <Link
                            key={`${timesheetDetailResponse.data.id}`}
                            href={`${timesheetDetailResponse.data.id}/edit`}
                        >
                            <StyledButton buttontype="edit" />
                        </Link>
                    </FormButtons>
                </FormSection>
            ) : (
                <Box>Not found</Box>
            )}
        </FormPage>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return (
        <UserContext.Consumer>
            {({ user }) =>
                id ? (
                    <TimesheetDetailPage timesheetId={Number(id)} user={user} />
                ) : null
            }
        </UserContext.Consumer>
    )
}

export default Page
