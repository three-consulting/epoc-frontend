import useSWR, { useSWRConfig } from "swr"
import { Customer } from "../types/apiTypes"
import { get, post } from "../utils/fetch"
import {
    swrToApiGetResponse,
    ApiGetResponse,
    UpdateHookArgs,
    UpdateHookFunction,
    updateToApiUpdateResponse,
} from "../types/hooks"
import { NEXT_PUBLIC_API_URL } from "../conf"

export const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/customer`

type CustomersUpdate = {
    postCustomer: UpdateHookFunction<Customer>
}

export const useCustomers = (): ApiGetResponse<Customer[]> =>
    swrToApiGetResponse(useSWR<Customer[], Error>(customerEndpointURL, get))

export const useUpdateCustomers = (): CustomersUpdate => {
    const { mutate } = useSWRConfig()

    const postCustomer = async (...[customer, errorHandler]: UpdateHookArgs<Customer>) => {
        const newCustomer = await post<Customer, Customer>(customerEndpointURL, customer).catch(errorHandler)
        mutate(customerEndpointURL)

        return updateToApiUpdateResponse(newCustomer || null)
    }

    return { postCustomer }
}
