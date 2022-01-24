import useSWR from 'swr';
import { EmployeeDTO } from '../types/dto';
import { get } from '../utils/fetch';
import { ApiResponseType, swrToData } from '../types/swrUtil';

const employeeEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/employee`;

type ReturnType = {
    employeesResponse: ApiResponseType<EmployeeDTO[]>;
};

function useEmployees(): ReturnType {
    const employeesResponse = swrToData(useSWR<EmployeeDTO[], Error>(employeeEndpointURL, get));
    return { employeesResponse };
}

export default useEmployees;
