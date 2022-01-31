import useSWR from "swr"
import { Employee } from "../types/apiTypes"
import { get } from "../utils/fetch"
import { ApiGetResponse, swrToApiGetResponse } from "../types/hooks"
import { NEXT_PUBLIC_API_URL } from "../conf"

const employeeEndpointURL = `${NEXT_PUBLIC_API_URL}/employee`

export const useEmployees = (): ApiGetResponse<Employee[]> =>
    swrToApiGetResponse(useSWR<Employee[], Error>(employeeEndpointURL, get))
