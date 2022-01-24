import useSWR from 'swr';
import { Employee } from '../types/apiTypes';
import { get } from '../utils/fetch';
import { ApiResponseType, swrToData } from '../types/swrUtil';

const employeeEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/employee`;

type ReturnType = {
    employeesResponse: ApiResponseType<Employee[]>;
};

function useEmployees(): ReturnType {
    const employeesResponse = swrToData(useSWR<Employee[], Error>(employeeEndpointURL, get));
    return { employeesResponse };
}

export default useEmployees;
