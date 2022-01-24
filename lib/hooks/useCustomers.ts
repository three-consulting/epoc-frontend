import useSWR, { useSWRConfig } from 'swr';
import { CustomerDTO } from '../types/dto';
import { get, post } from '../utils/fetch';
import { swrToData, ApiResponseType } from '../types/swrUtil';

export const customerEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/customer`;

type ReturnType = {
    customersResponse: ApiResponseType<CustomerDTO[]>;
    postCustomer: (customer: CustomerDTO) => void;
};

function useCustomers(): ReturnType {
    const { mutate } = useSWRConfig();

    const customersResponse = swrToData(useSWR<CustomerDTO[], Error>(customerEndpointURL, get));
    const postCustomer = async (customer: CustomerDTO) => {
        const response = await post(customerEndpointURL, customer);
        mutate(customerEndpointURL);
        return response;
    };
    return { customersResponse, postCustomer };
}

export default useCustomers;
