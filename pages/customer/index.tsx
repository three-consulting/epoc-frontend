import React, { useContext } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import { useCustomers } from "@/lib/hooks/useCustomers"
import CustomerTable from "@/components/table/CustomerTable"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"

const Customers: NextPage = () => {
    const { user } = useContext(UserContext)
    const customersResponse = useCustomers(user)

    return (
        <div>
            <Heading fontWeight="black" margin="1rem 0rem">
                Customers
            </Heading>
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
        </div>
    )
}

export default Customers
