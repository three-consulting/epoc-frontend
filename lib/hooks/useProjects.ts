import useSWR, { useSWRConfig } from 'swr';
import { Project } from '../types/apiTypes';
import { get, post } from '../utils/fetch';
import { ApiResponseType, swrToData } from '../types/swrUtil';

const projectEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/project`;

type ReturnType = {
    projectsResponse: ApiResponseType<Project[]>;
    postProject: (project: Project) => void;
};

function useProjects(): ReturnType {
    const { mutate } = useSWRConfig();

    const projectsResponse = swrToData(useSWR<Project[], Error>(projectEndpointURL, get));
    const postProject = async (project: Project) => {
        const response = await post(projectEndpointURL, project);
        mutate(projectEndpointURL);
        return response;
    };
    return { projectsResponse, postProject };
}

export default useProjects;
