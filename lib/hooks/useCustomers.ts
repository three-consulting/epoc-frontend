import useSWR, { useSWRConfig } from 'swr';
import { Customer } from '../types/apiTypes';
import { get, post } from '../utils/fetch';
import { swrToData, ApiResponseType } from '../types/swrUtil';

export const customerEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/customer`;

type CustomerList = {
    customersResponse: ApiResponseType<Customer[]>;
};

type CustomersUpdate = {
    postCustomer: (customer: Customer, errorHandler: (error: Error) => void) => Promise<Customer | undefined>;
};

export const useCustomers = (): CustomerList => {
    const customersResponse = swrToData(useSWR<Customer[], Error>(customerEndpointURL, get));
    return { customersResponse };
};

export const useUpdateCustomers = (): CustomersUpdate => {
    const { mutate } = useSWRConfig();
    const postCustomer = async (customer: Customer, errorHandler: (error: Error) => void) => {
        const newCustomer = await post<Customer, Customer>(customerEndpointURL, customer).catch(errorHandler);
        mutate(customerEndpointURL);
        return newCustomer || undefined;
    };
    return { postCustomer };
};
