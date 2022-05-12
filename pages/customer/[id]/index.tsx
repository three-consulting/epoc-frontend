import React, { useContext } from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import CustomerDetail from "@/components/detail/CustomerDetail"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useCustomerDetail } from "@/lib/hooks/useCustomers"

type Props = {
    customerId: number
}

function CustomerDetailPage({ customerId }: Props): JSX.Element {
    const { user } = useContext(UserContext)
    const customerDetailResponse = useCustomerDetail(customerId, user)

    return (
        <div>
            {customerDetailResponse.isLoading && <Loading />}
            {customerDetailResponse.isError && (
                <ErrorAlert title="Error" message="Error" />
            )}
            {customerDetailResponse.isSuccess ? (
                <>
                    <CustomerDetail customer={customerDetailResponse.data} />
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
    return id ? <CustomerDetailPage customerId={Number(id)} /> : null
}

export default Page
