import useSWR, { useSWRConfig } from 'swr';
import { Project } from '../types/apiTypes';
import { get, post, put } from '../utils/fetch';
import { ApiResponseType, swrToData } from '../types/swrUtil';

const projectEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/project`;
const projectIdEndpointURL = (id: number): string => `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`;

interface ProjectList {
    projectsResponse: ApiResponseType<Project[]>;
}

interface ProjectDetail {
    projectDetailResponse: ApiResponseType<Project>;
}
interface UpdateProjects {
    postProject: (project: Project) => void;
    putProject: (project: Project) => void;
}

export const useProjects = (): ProjectList => {
    const projectsResponse = swrToData(useSWR<Project[], Error>(projectEndpointURL, get));
    return { projectsResponse };
};

export const useProjectDetail = (id: number): ProjectDetail => {
    const projectDetailResponse = swrToData(useSWR<Project, Error>(projectIdEndpointURL(id), get));
    return { projectDetailResponse };
};

export const useUpdateProjects = (): UpdateProjects => {
    const { mutate } = useSWRConfig();
    const postProject = async (project: Project) => {
        const response = await post(projectEndpointURL, project);
        mutate(projectEndpointURL);
        return response;
    };
    const putProject = async (project: Project) => {
        const response = await put(projectEndpointURL, project);
        mutate(projectEndpointURL);
        return response;
    };
    return { postProject, putProject };
};
