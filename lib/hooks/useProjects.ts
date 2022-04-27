import useSWR, { useSWRConfig } from "swr"
import { Project } from "../types/apiTypes"
import { get, post, put } from "../utils/fetch"
import {
    ApiGetResponse,
    swrToApiGetResponse,
    UpdateHookArgs,
    UpdateHookFunction,
    updateToApiUpdateResponse,
} from "../types/hooks"
import { useMatchMutate } from "../utils/matchMutate"
import { NEXT_PUBLIC_API_URL } from "../conf"
import { User } from "firebase/auth"

const projectEndpointURL = `${NEXT_PUBLIC_API_URL}/project`
const projectIdEndpointURL = (id: number): string =>
    `${NEXT_PUBLIC_API_URL}/project/${id}`
const projectIdEndpointCacheKey = (id: number): string => `/project/${id}`

const projectIdEndpointCacheKeyRegex = /^\/project\/([0-9]+)$/

interface UpdateProjects {
    postProject: UpdateHookFunction<Project>
    putProject: UpdateHookFunction<Project>
}

export const useProjects = (user: User): ApiGetResponse<Project[]> =>
    swrToApiGetResponse(
        useSWR<Project[], Error>(projectEndpointURL, () =>
            get(projectEndpointURL, user)
        )
    )

export const useProjectDetail = (
    id: number,
    user: User
): ApiGetResponse<Project> =>
    swrToApiGetResponse(
        useSWR<Project, Error>(projectIdEndpointCacheKey(id), () =>
            get(projectIdEndpointURL(id), user)
        )
    )

export const useUpdateProjects = (user: User): UpdateProjects => {
    const { mutate } = useSWRConfig()
    const matchMutate = useMatchMutate()

    const postProject = async (
        ...[project, errorHandler]: UpdateHookArgs<Project>
    ) => {
        const newProject = await post<Project, Project>(
            projectEndpointURL,
            user,
            project
        ).catch(errorHandler)
        mutate(projectEndpointURL)
        matchMutate(projectIdEndpointCacheKeyRegex)

        return updateToApiUpdateResponse(newProject || null)
    }

    const putProject = async (
        ...[project, errorHandler]: UpdateHookArgs<Project>
    ) => {
        const updatedProject = await put<Project, Project>(
            projectEndpointURL,
            user,
            project
        ).catch(errorHandler)
        mutate(projectEndpointURL)
        matchMutate(projectIdEndpointCacheKeyRegex)

        return updateToApiUpdateResponse(updatedProject || null)
    }

    return { postProject, putProject }
}
