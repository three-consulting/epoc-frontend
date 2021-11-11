import useSWR from 'swr';
import { components } from '../types/api';
import * as fetch from '../utils/fetch';

interface CustomerResponse {
    customers?: components['schemas']['CustomerDTO'][];
    isLoading: boolean;
    isError?: Error;
}

function useCustomers(): CustomerResponse {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/customer`;
    const { data: customers, error } = useSWR<components['schemas']['CustomerDTO'][], Error>(endpoint, fetch.get);

    return { customers, isLoading: !customers && !error, isError: error };
}

export default useCustomers;
