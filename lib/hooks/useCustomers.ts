import useSWR, { useSWRConfig } from 'swr';
import { Customer } from '../types/apiTypes';
import { get, post } from '../utils/fetch';
import { swrToData, ApiResponseType } from '../types/swrUtil';

export const customerEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/customer`;

type ReturnType = {
    customersResponse: ApiResponseType<Customer[]>;
    postCustomer: (customer: Customer) => void;
};

function useCustomers(): ReturnType {
    const { mutate } = useSWRConfig();

    const customersResponse = swrToData(useSWR<Customer[], Error>(customerEndpointURL, get));
    const postCustomer = async (customer: Customer) => {
        const response = await post(customerEndpointURL, customer);
        mutate(customerEndpointURL);
        return response;
    };
    return { customersResponse, postCustomer };
}

export default useCustomers;
