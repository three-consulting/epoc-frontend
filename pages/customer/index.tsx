import React, { useContext } from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import CustomerTable from "@/components/table/CustomerTable"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useCustomers } from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"

const Customers: NextPage = () => {
    const { user } = useContext(UserContext)
    const customersResponse = useCustomers(user)

    return (
        <FormPage header="Customers">
            {customersResponse.isLoading && <Loading />}
            {customersResponse.isError && (
                <ErrorAlert
                    title={customersResponse.errorMessage}
                    message={customersResponse.errorMessage}
                />
            )}
            {customersResponse.isSuccess && (
                <CustomerTable customers={customersResponse.data} />
            )}
        </FormPage>
    )
}

export default Customers
