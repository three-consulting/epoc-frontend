import useSWR from 'swr';
import { Employee } from '../types/apiTypes';
import { get } from '../utils/fetch';
import { ApiResponseType, swrToData } from '../types/swrUtil';

const employeeEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/employee`;

type EmployeeList = {
    employeesResponse: ApiResponseType<Employee[]>;
};

export const useEmployees = (): EmployeeList => {
    const employeesResponse = swrToData(useSWR<Employee[], Error>(employeeEndpointURL, get));
    return { employeesResponse };
};
