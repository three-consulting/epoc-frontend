import React, { useContext } from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import EmployeeDetail from "@/components/detail/EmployeeDetail"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { Button } from "@chakra-ui/react"
import Link from "next/link"
import { useEmployeeDetail } from "@/lib/hooks/useDetail"

type Props = {
    employeeId: number
}

function EmployeeDetailPage({ employeeId }: Props): JSX.Element {
    const { user } = useContext(UserContext)
    const employeeDetailResponse = useEmployeeDetail(employeeId, user)

    return (
        <div>
            {employeeDetailResponse.isLoading && <Loading />}
            {employeeDetailResponse.isError && (
                <ErrorAlert title="Error" message="Error" />
            )}
            {employeeDetailResponse.isSuccess ? (
                <>
                    <EmployeeDetail employee={employeeDetailResponse.data} />
                </>
            ) : (
                <Box>Not found</Box>
            )}
            <Link key={`${employeeId}`} href={`${employeeId}/edit`}>
                <Button colorScheme="blue" marginTop="1rem">
                    Edit employee
                </Button>
            </Link>
        </div>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <EmployeeDetailPage employeeId={Number(id)} /> : null
}

export default Page
