import { User } from "firebase/auth"
import useSWR, { mutate } from "swr"
import _ from "lodash"
import { NEXT_PUBLIC_API_URL } from "../conf"
import {
    ApiGetResponse,
    DeleteHookArgs,
    swrToApiGetResponse,
    UpdateHookArgs,
    updateToApiUpdateResponse,
} from "../types/hooks"
import { del, pathToUrl, getJSON, post, put } from "../utils/fetch"

export type Endpoint =
    | `customer`
    | `employee`
    | `project`
    | `task`
    | `timesheet`
    | `timesheet-entry`
    | `timesheet-entries`
    | `time-category`

type CacheKeyData = {
    key: string
    deps: Endpoint[]
}

export const endpointRegex = (endpoint: Endpoint): RegExp =>
    new RegExp(`^/${endpoint}([/|?].+)?`)

export const prefixEndpoint = (endpoint: Endpoint) =>
    `${NEXT_PUBLIC_API_URL}/${endpoint}`
export const listEndpoint = (endpoint: Endpoint): string =>
    prefixEndpoint(endpoint)
export const detailEndpoint = (endpoint: Endpoint, id: number): string =>
    `${prefixEndpoint(endpoint)}/${id}`
export const urlToCacheKey = (url: URL): string =>
    `${url.pathname}${url.search}`
export const firebaseSyncEndpoint = (endpoint: Endpoint): string =>
    `${prefixEndpoint(`employee`)}/${endpoint}`

export const getAndMutate = async (
    url: string,
    deps: Endpoint[],
    user?: User
) => {
    const response = await getJSON(url, user)
    mutate((key: string) =>
        deps.map((endpoint) => mutateByEndpoint(endpoint)(key)).includes(true)
    )
    return response
}

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
    params?: Record<string, string | number | undefined>
): ApiGetResponse<T> => {
    const pars = _.pickBy(params, (x) => !_.isUndefined(x)) as Record<
        string,
        string | number
    >
    const key = getCacheKey(endpoint, deps, pars)
    return swrToApiGetResponse(
        useSWR<T, Error>(
            () => key,
            () => getJSON(endpoint ?? "", user, pars)
        )
    )
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
    const filter = mutateByEndpoint(endpoint)
    const refresh = () => mutate((key: string) => filter(key))

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
