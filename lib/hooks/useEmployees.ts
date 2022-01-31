import useSWR from "swr"
import { Employee } from "../types/apiTypes"
import { get } from "../utils/fetch"
import { ApiGetResponse, swrToApiGetResponse } from "../types/hooks"

const employeeEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/employee`

export const useEmployees = (): ApiGetResponse<Employee[]> =>
    swrToApiGetResponse(useSWR<Employee[], Error>(employeeEndpointURL, get))
