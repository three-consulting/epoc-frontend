import { User } from "firebase/auth"
import useSWR from "swr"
import { NEXT_PUBLIC_API_URL } from "../conf"
import {
    ApiGetResponse,
    DeleteHookArgs,
    swrToApiGetResponse,
    UpdateHookArgs,
    updateToApiUpdateResponse,
} from "../types/hooks"
import { del, pathToUrl, getJSON, post, put } from "../utils/fetch"
import { useMatchMutate } from "../utils/matchMutate"

export type Endpoint =
    | `customer`
    | `employee`
    | `project`
    | `task`
    | `timesheet`
    | `timesheet-entry`
    | `timesheet-entries`
    | `time-category`
    | `employee-sync`

export const endpointRegex = (endpoint: Endpoint): RegExp =>
    new RegExp(`^/${endpoint}([/|?].+)?`)

const prefixEndpoint = (endpoint: Endpoint) =>
    `${NEXT_PUBLIC_API_URL}/${endpoint}`
export const listEndpoint = (endpoint: Endpoint): string =>
    prefixEndpoint(endpoint)
export const detailEndpoint = (endpoint: Endpoint, id: number): string =>
    `${prefixEndpoint(endpoint)}/${id}`
export const urlToCacheKey = (url: URL): string =>
    `${url.pathname}${url.search}`
export const firebaseSyncEndpoint = (endpoint: Endpoint): string =>
    `${prefixEndpoint(`employee`)}/${endpoint}`

const getCacheKey = (
    endpoint: string | null,
    deps: Endpoint[],
    params?: Record<string, string | number>
) => {
    const key = endpoint ? urlToCacheKey(pathToUrl(endpoint, params)) : null
    if (key) {
        return JSON.stringify({ key, deps })
    }
    return undefined
}

export const useGet = <T>(
    endpoint: string | null,
    deps: Endpoint[],
    user?: User,
    params?: Record<string, string | number>
): ApiGetResponse<T> => {
    const key = getCacheKey(endpoint, deps, params)
    return swrToApiGetResponse(
        useSWR<T, Error>(
            () => key,
            () => getJSON(endpoint ?? "", user, params)
        )
    )
}

type CacheKeyData = {
    key: string
    deps: Endpoint[]
}

const jsonOrNull = (str: string): CacheKeyData | undefined => {
    try {
        return JSON.parse(str)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error parsing JSON")
        return undefined
    }
}

const mutateByEndpoint = (endpoint: Endpoint) => (key: string) => {
    const json = jsonOrNull(key)
    if (json) {
        const { deps } = json
        return deps.includes(endpoint)
    }
    return false
}

export const useUpdate = (endpoint: Endpoint, user: User) => {
    const matchMutate = useMatchMutate()
    const refresh = () => matchMutate(mutateByEndpoint(endpoint))

    return {
        post: async <T>(...[item, errorHandler]: UpdateHookArgs<T>) => {
            const newItem = await post<T, T>(
                listEndpoint(endpoint),
                item,
                user
            ).catch(errorHandler)
            refresh()

            return updateToApiUpdateResponse(newItem || null)
        },

        put: async <T>(...[item, errorHandler]: UpdateHookArgs<T>) => {
            const updatedItem = await put<T, T>(
                listEndpoint(endpoint),
                item,
                user
            ).catch(errorHandler)
            refresh()

            return updateToApiUpdateResponse(updatedItem || null)
        },

        delete: async <T>(...[id, errorHandler]: DeleteHookArgs) => {
            await del<T>(detailEndpoint(endpoint, id), user).catch(errorHandler)
            refresh()
        },
    }
}
