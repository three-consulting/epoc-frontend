import React, { useContext } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/dist/client/router"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { EditCustomerForm } from "@/components/form/CustomerForm"
import { useCustomerDetail } from "@/lib/hooks/useDetail"
import FormPage from "@/components/common/FormPage"
import { Box } from "@chakra-ui/react"

type Props = {
    customerId: number
}

function EditCustomerPage({ customerId }: Props): JSX.Element {
    const router = useRouter()
    const { user } = useContext(UserContext)

    const customerDetailResponse = useCustomerDetail(customerId, user)

    const errorMessage =
        (customerDetailResponse.isError &&
            customerDetailResponse.errorMessage) ||
        ""

    const redirectToCustomerDetail = () =>
        router.push(`/customer/${customerId}`)

    return (
        <FormPage header="Edit customer">
            <Box>
                {customerDetailResponse.isLoading && <Loading />}
                {customerDetailResponse.isError && (
                    <ErrorAlert title={errorMessage} message={errorMessage} />
                )}
                {customerDetailResponse.isSuccess &&
                    customerDetailResponse.data.id && (
                        <EditCustomerForm
                            customer={customerDetailResponse.data}
                            afterSubmit={redirectToCustomerDetail}
                            onCancel={redirectToCustomerDetail}
                        />
                    )}
            </Box>
        </FormPage>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <EditCustomerPage customerId={Number(id)} /> : null
}

export default Edit
