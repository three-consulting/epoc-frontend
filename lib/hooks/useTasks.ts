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

const taskEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/task`

type UpdateTasks = {
    postTask: UpdateHookFunction<Task>
    putTask: UpdateHookFunction<Task>
}

const useTasks = (projectId: number): ApiGetResponse<Task[]> =>
    swrToApiGetResponse(useSWR<Task[], Error>(taskEndpointURL, () => get(taskEndpointURL, { projectId: projectId })))

export const useUpdateTasks = (): UpdateTasks => {
    const { mutate } = useSWRConfig()

    const postTask = async (...[task, errorHandler]: UpdateHookArgs<Task>) => {
        const newTask = await post<Task, Task>(taskEndpointURL, task).catch(errorHandler)
        mutate(taskEndpointURL)
        return updateToApiUpdateResponse(newTask || undefined)
    }

    const putTask = async (...[task, errorHandler]: UpdateHookArgs<Task>) => {
        const updatedTask = await put<Task, Task>(taskEndpointURL, task).catch(errorHandler)
        mutate(taskEndpointURL)
        return updateToApiUpdateResponse(updatedTask || undefined)
    }

    return { postTask, putTask }
}

export default useTasks
