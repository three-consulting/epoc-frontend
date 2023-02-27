import React, { useContext } from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import CustomerDetail from "@/components/detail/CustomerDetail"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import Link from "next/link"
import { useCustomerDetail } from "@/lib/hooks/useDetail"
import { StyledButton } from "@/components/common/Buttons"
import FormButtons from "@/components/common/FormButtons"
import FormPage from "@/components/common/FormPage"
import FormSection from "@/components/common/FormSection"
import { User } from "firebase/auth"

interface ICustomerDetailPage {
    customerId: number
    user: User
}

const CustomerDetailPage = ({
    customerId,
    user,
}: ICustomerDetailPage): JSX.Element => {
    const customerDetailResponse = useCustomerDetail(customerId, user)

    const getHeader = () =>
        customerDetailResponse.isSuccess
            ? customerDetailResponse.data.name
            : "-"

    return (
        <FormPage header="Customers">
            {customerDetailResponse.isLoading && <Loading />}
            {customerDetailResponse.isError && (
                <ErrorAlert title="Error" message="Error" />
            )}
            <FormSection header={getHeader()}>
                {customerDetailResponse.isSuccess ? (
                    <CustomerDetail customer={customerDetailResponse.data} />
                ) : (
                    <Box>Not found</Box>
                )}
                <FormButtons>
                    <Link key={`${customerId}`} href={`${customerId}/edit`}>
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
    const { user } = useContext(UserContext)
    return id ? (
        <CustomerDetailPage customerId={Number(id)} user={user} />
    ) : null
}

export default Page
