import useSWR from 'swr';
import { components } from '../types/api';
import fetcher from '../utils/fetcher';

interface EmployeeResponse {
    employees?: components['schemas']['EmployeeDTO'][];
    isLoading: boolean;
    isError?: Error;
}

function useEmployees(): EmployeeResponse {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/employee`;
    const { data: employees, error } = useSWR<components['schemas']['EmployeeDTO'][], Error>(endpoint, fetcher);

    return { employees, isLoading: !employees && !error, isError: error };
}

export default useEmployees;
