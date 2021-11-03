import useSWR from 'swr';
import { components } from '../types/api';
import fetcher from '../utils/fetcher';

interface CustomerResponse {
    customers?: components['schemas']['CustomerDTO'][];
    isLoading: boolean;
    isError: any;
}

function useCustomers(): CustomerResponse {
    const endpoint = process.env.NEXT_PUBLIC_API_URL + '/customer';
    const { data: customers, error } = useSWR<components['schemas']['CustomerDTO'][]>(endpoint, fetcher);

    return { customers, isLoading: !customers && !error, isError: error };
}

export default useCustomers;
