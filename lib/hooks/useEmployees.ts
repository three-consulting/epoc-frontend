import useSWR from 'swr';
import { components } from '../types/api';
import fetcher from '../utils/fetcher';

interface EmployeeResponse {
    employees?: components['schemas']['EmployeeDTO'][];
    isLoading: boolean;
    isError?: Error;
}

function useEmployees(): EmployeeResponse {
    // actual endpoint
    const endpoint = process.env.NEXT_PUBLIC_API_URL + '/employee';
    // mock endpoint
    // const endpoint = 'http://localhost:3000/api/employees';
    const { data: employees, error } = useSWR<components['schemas']['EmployeeDTO'][], Error>(endpoint, fetcher);

    return { employees, isLoading: !employees && !error, isError: error };
}

export default useEmployees;
