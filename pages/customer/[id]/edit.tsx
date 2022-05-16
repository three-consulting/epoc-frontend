import React, { useContext } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useRouter } from "next/dist/client/router"
import { useCustomerDetail } from "@/lib/hooks/useCustomers"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { EditCustomerForm } from "@/components/form/CustomerForm"

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
        <div>
            <Heading fontWeight="black" margin="1rem 0rem">
                Edit customer
            </Heading>
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
        </div>
    )
}

const Edit: NextPage = () => {
    const router = useRouter()
    const id = router.query.id as string | undefined
    return id ? <EditCustomerPage customerId={Number(id)} /> : null
}

export default Edit
