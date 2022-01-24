import useSWR, { useSWRConfig } from 'swr';
import { ProjectDTO } from '../types/dto';
import { get, post } from '../utils/fetch';
import { ApiResponseType, swrToData } from '../types/swrUtil';

const projectEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/project`;

type ReturnType = {
    projectsResponse: ApiResponseType<ProjectDTO[]>;
    postProject: (project: ProjectDTO) => void;
};

function useProjects(): ReturnType {
    const { mutate } = useSWRConfig();

    const projectsResponse = swrToData(useSWR<ProjectDTO[], Error>(projectEndpointURL, get));
    const postProject = async (project: ProjectDTO) => {
        const response = await post(projectEndpointURL, project);
        mutate(projectEndpointURL);
        return response;
    };
    return { projectsResponse, postProject };
}

export default useProjects;
