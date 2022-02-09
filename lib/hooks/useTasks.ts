import useSWR, { useSWRConfig } from "swr"
import { Task } from "../types/apiTypes"
import { get, post, put } from "../utils/fetch"
import {
    swrToApiGetResponse,
    ApiGetResponse,
    UpdateHookArgs,
    UpdateHookFunction,
    updateToApiUpdateResponse,
} from "../types/hooks"
import { NEXT_PUBLIC_API_URL } from "../conf"
import { useMatchMutate } from "../utils/matchMutate"

const taskEndpointURL = `${NEXT_PUBLIC_API_URL}/task`
const taskIdEndpointURL = (id: number): string =>
    `${NEXT_PUBLIC_API_URL}/task/${id}`
const taskIdEndpointCacheKey = (id: number): string => `/task/${id}`

const taskIdEndpointCacheKeyRegex = /^\/task\/([0-9]+)$/

type UpdateTasks = {
    postTask: UpdateHookFunction<Task>
    putTask: UpdateHookFunction<Task>
}

const useTasks = (projectId: number): ApiGetResponse<Task[]> =>
    swrToApiGetResponse(
        useSWR<Task[], Error>(taskEndpointURL, () =>
            get(taskEndpointURL, { projectId })
        )
    )

export const useTaskDetail = (id: number): ApiGetResponse<Task> =>
    swrToApiGetResponse(
        useSWR<Task, Error>(taskIdEndpointCacheKey(id), () =>
            get(taskIdEndpointURL(id))
        )
    )

export const useUpdateTasks = (): UpdateTasks => {
    const { mutate } = useSWRConfig()
    const matchMutate = useMatchMutate()

    const postTask = async (...[task, errorHandler]: UpdateHookArgs<Task>) => {
        const newTask = await post<Task, Task>(taskEndpointURL, task).catch(
            errorHandler
        )
        mutate(taskEndpointURL)
        matchMutate(taskIdEndpointCacheKeyRegex)

        return updateToApiUpdateResponse(newTask || null)
    }

    const putTask = async (...[task, errorHandler]: UpdateHookArgs<Task>) => {
        const updatedTask = await put<Task, Task>(taskEndpointURL, task).catch(
            errorHandler
        )
        mutate(taskEndpointURL)
        matchMutate(taskIdEndpointCacheKeyRegex)

        return updateToApiUpdateResponse(updatedTask || null)
    }

    return { postTask, putTask }
}

export default useTasks
