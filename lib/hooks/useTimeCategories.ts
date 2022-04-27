import { User } from "firebase/auth"
import useSWR from "swr"
import { NEXT_PUBLIC_API_URL } from "../conf"
import { TimeCategory } from "../types/apiTypes"
import { ApiGetResponse, swrToApiGetResponse } from "../types/hooks"
import { get } from "../utils/fetch"

const timeCategoryEndpointURL = `${NEXT_PUBLIC_API_URL}/time-category`

export const useTimeCategories = (user: User): ApiGetResponse<TimeCategory[]> =>
    swrToApiGetResponse(
        useSWR<TimeCategory[], Error>(timeCategoryEndpointURL, () =>
            get(timeCategoryEndpointURL, user)
        )
    )
