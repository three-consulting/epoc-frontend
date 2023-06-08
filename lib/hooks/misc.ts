import { User } from "firebase/auth"
import useSWR from "swr"
import { ApiGetResponse, swrToApiGetResponse } from "../types/hooks"
import { getJSON, pathToUrl } from "../utils/fetch"
import { Endpoint, listEndpoint, urlToCacheKey } from "./swrInterface"

interface UseFlexProps {
    user: User
    email: string
}

export const useFlex = ({
    user,
    email,
}: UseFlexProps): ApiGetResponse<number> => {
    const endpoint = listEndpoint("timesheet-entry/flex" as Endpoint)
    const key = urlToCacheKey(pathToUrl(endpoint, { email }))
    return swrToApiGetResponse(
        useSWR<number, Error>(
            () => key,
            () => getJSON(endpoint ?? "", user, { email })
        )
    )
}
