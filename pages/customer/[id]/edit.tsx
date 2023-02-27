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
import { User } from "firebase/auth"

type Props = {
    customerId: number
    user: User
}

function EditCustomerPage({ customerId, user }: Props): JSX.Element {
    const router = useRouter()

    const customerDetailResponse = useCustomerDetail(customerId, user)

    const errorMessage =
        (customerDetailResponse.isError &&
            customerDetailResponse.errorMessage) ||
        ""

    const redirectToCustomerDetail = () =>
        router.push(`/customer/${customerId}`)

    return (
        <FormPage header="Customers">
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
                            user={user}
                        />
                    )}
            </Box>
        </FormPage>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    const { user } = useContext(UserContext)
    return id ? <EditCustomerPage customerId={Number(id)} user={user} /> : null
}

export default Edit
