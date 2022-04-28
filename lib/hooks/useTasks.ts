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
import { User } from "firebase/auth"

const taskEndpointURL = `${NEXT_PUBLIC_API_URL}/task`
const taskByProjectEndpointURL = (projectId: number) =>
    `${NEXT_PUBLIC_API_URL}/task?projectId=${projectId}`

type UpdateTasks = {
    postTask: UpdateHookFunction<Task>
    putTask: UpdateHookFunction<Task>
}

const useTasks = (projectId: number, user: User): ApiGetResponse<Task[]> =>
    swrToApiGetResponse(
        useSWR<Task[], Error>(taskByProjectEndpointURL(projectId), () =>
            get(taskEndpointURL, user, { projectId })
        )
    )

export const useUpdateTasks = (user: User): UpdateTasks => {
    const { mutate } = useSWRConfig()

    const postTask = async (...[task, errorHandler]: UpdateHookArgs<Task>) => {
        const newTask = await post<Task, Task>(
            taskEndpointURL,
            user,
            task
        ).catch(errorHandler)
        mutate(taskEndpointURL)

        return updateToApiUpdateResponse(newTask || null)
    }

    const putTask = async (...[task, errorHandler]: UpdateHookArgs<Task>) => {
        const updatedTask = await put<Task, Task>(
            taskEndpointURL,
            user,
            task
        ).catch(errorHandler)
        mutate(taskEndpointURL)

        return updateToApiUpdateResponse(updatedTask || null)
    }

    return { postTask, putTask }
}

export default useTasks
