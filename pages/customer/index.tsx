import React from "react"
import type { NextPage } from "next"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import CustomerTable from "@/components/table/CustomerTable"
import { useCustomers } from "@/lib/hooks/useList"
import FormPage from "@/components/common/FormPage"

const Customers: NextPage = () => {
    const customersResponse = useCustomers()

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
