import useSWR from 'swr';
import { components } from '../types/api';
import fetcher from '../utils/fetcher';

interface CustomerResponse {
    customers?: components['schemas']['CustomerDTO'][];
    isLoading: boolean;
    isError?: Error;
}

function useCustomers(): CustomerResponse {
    // mock endpoint
    // const endpoint = 'http://localhost:3000/api/customers';
    // actual endpoint
    const endpoint = process.env.NEXT_PUBLIC_API_URL + '/customer';
    const { data: customers, error } = useSWR<components['schemas']['CustomerDTO'][], Error>(endpoint, fetcher);

    return { customers, isLoading: !customers && !error, isError: error };
}

export default useCustomers;
