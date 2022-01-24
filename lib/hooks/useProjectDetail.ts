import useSWR, { useSWRConfig } from 'swr';
import { Project } from '../types/apiTypes';
import { get, put } from '../utils/fetch';
import { ApiResponseType, swrToData } from '../types/swrUtil';

const projectIdEndpointURL = (id: number): string => `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`;
const projectEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/project`;

type ReturnType = {
    projectDetailResponse: ApiResponseType<Project>;
    putProject: (project: Project) => void;
};

function useProjectDetail(id: number): ReturnType {
    const { mutate } = useSWRConfig();

    const projectDetailResponse = swrToData(useSWR<Project, Error>(projectIdEndpointURL(id), get));
    const putProject = async (project: Project) => {
        const response = await put(projectEndpointURL, project);
        mutate(projectIdEndpointURL(id));
        return response;
    };
    return { projectDetailResponse, putProject };
}

export default useProjectDetail;
