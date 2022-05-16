import useSWR, { useSWRConfig } from "swr"
import { Customer } from "../types/apiTypes"
import { get, post, put } from "../utils/fetch"
import {
    swrToApiGetResponse,
    ApiGetResponse,
    UpdateHookArgs,
    UpdateHookFunction,
    updateToApiUpdateResponse,
} from "../types/hooks"
import { NEXT_PUBLIC_API_URL } from "../conf"
import { User } from "firebase/auth"
import { useMatchMutate } from "../utils/matchMutate"

export const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/customer`
const customerIdEndpointURL = (id: number): string =>
    `${NEXT_PUBLIC_API_URL}/customer/${id}`
const customerIdEndpointCacheKey = (customerId: number): string =>
    `/customer/${customerId}`
const customerIdEndpointCacheKeyRegex = /^\/customer\/([0-9]+)$/

interface UpdateCustomers {
    postCustomer: UpdateHookFunction<Customer>
    putCustomer: UpdateHookFunction<Customer>
}

export const useCustomerDetail = (
    id: number,
    user: User
): ApiGetResponse<Customer> =>
    swrToApiGetResponse(
        useSWR<Customer, Error>(customerIdEndpointCacheKey(id), () =>
            get(customerIdEndpointURL(id), user)
        )
    )

export const useCustomers = (user: User): ApiGetResponse<Customer[]> =>
    swrToApiGetResponse(
        useSWR<Customer[], Error>(customerEndpointURL, () =>
            get(customerEndpointURL, user)
        )
    )

export const useUpdateCustomers = (user: User): UpdateCustomers => {
    const { mutate } = useSWRConfig()
    const matchMutate = useMatchMutate()

    const postCustomer = async (
        ...[customer, errorHandler]: UpdateHookArgs<Customer>
    ) => {
        const newCustomer = await post<Customer, Customer>(
            customerEndpointURL,
            user,
            customer
        ).catch(errorHandler)
        mutate(customerEndpointURL)
        matchMutate(customerIdEndpointCacheKeyRegex)

        return updateToApiUpdateResponse(newCustomer || null)
    }

    const putCustomer = async (
        ...[customer, errorHandler]: UpdateHookArgs<Customer>
    ) => {
        const updatedCustomer = await put<Customer, Customer>(
            customerEndpointURL,
            user,
            customer
        ).catch(errorHandler)
        mutate(customerEndpointURL)
        matchMutate(customerIdEndpointCacheKeyRegex)

        return updateToApiUpdateResponse(updatedCustomer || null)
    }

    return { postCustomer, putCustomer }
}
