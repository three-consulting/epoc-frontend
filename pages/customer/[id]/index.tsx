import React from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import CustomerDetail from "@/components/detail/CustomerDetail"
import Link from "next/link"
import { useCustomerDetail } from "@/lib/hooks/useDetail"
import { StyledButton } from "@/components/common/Buttons"
import StyledButtons from "@/components/common/StyledButtons"
import FormPage from "@/components/common/FormPage"
import FormSection from "@/components/common/FormSection"

type Props = {
    customerId: number
}

function CustomerDetailPage({ customerId }: Props): JSX.Element {
    const customerDetailResponse = useCustomerDetail(customerId)

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
                <StyledButtons>
                    <Link key={`${customerId}`} href={`${customerId}/edit`}>
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
    return id ? <CustomerDetailPage customerId={Number(id)} /> : null
}

export default Page
