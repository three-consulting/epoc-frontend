import React, { useContext } from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import TimesheetDetail from "@/components/detail/TimesheetDetail"
import Link from "next/link"
import { Button } from "@chakra-ui/react"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useTimesheetDetail } from "@/lib/hooks/useDetail"

type Props = {
    timesheetId: number
}

function TimesheetDetailPage({ timesheetId }: Props): JSX.Element {
    const { user } = useContext(UserContext)
    const timesheetDetailResponse = useTimesheetDetail(timesheetId, user)

    return (
        <div>
            {timesheetDetailResponse.isLoading && <Loading />}
            {timesheetDetailResponse.isError && (
                <ErrorAlert
                    title={timesheetDetailResponse.errorMessage}
                    message={timesheetDetailResponse.errorMessage}
                />
            )}
            {timesheetDetailResponse.isSuccess ? (
                <>
                    <TimesheetDetail timesheet={timesheetDetailResponse.data} />
                    <Link
                        key={`${timesheetDetailResponse.data.id}`}
                        href={`${timesheetDetailResponse.data.id}/edit`}
                    >
                        <Button colorScheme="blue" marginTop="1rem">
                            Edit Timesheet
                        </Button>
                    </Link>
                </>
            ) : (
                <Box>Not found</Box>
            )}
        </div>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const id = router.query.id as string | undefined
    return id ? <TimesheetDetailPage timesheetId={Number(id)} /> : null
}

export default Page
