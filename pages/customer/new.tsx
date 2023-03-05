import React from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { Customer } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import FormPage from "@/components/common/FormPage"
import { CreateCustomerForm } from "@/components/form/CustomerForm"
import { User } from "firebase/auth"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"

interface INewCustomerForm {
    user: User
}

const NewCustomerForm = ({ user }: INewCustomerForm) => {
    const router = useRouter()

    const redirectToCustomerList = () => router.push("/customer")
    const redirectToCustomerDetails = (
        createCustomerResponse: ApiUpdateResponse<Customer>
    ) =>
        createCustomerResponse.isSuccess &&
        createCustomerResponse.data.id &&
        router.push(`/customer/${createCustomerResponse.data.id}`)

    return (
        <FormPage header="New customer">
            <CreateCustomerForm
                afterSubmit={redirectToCustomerDetails}
                onCancel={redirectToCustomerList}
                user={user}
            />
        </FormPage>
    )
}

const New: NextPage = () => (
    <UserContext.Consumer>
        {({ user }) => <NewCustomerForm user={user} />}
    </UserContext.Consumer>
)
export default New
