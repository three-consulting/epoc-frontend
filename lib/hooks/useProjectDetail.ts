import useSWR, { useSWRConfig } from 'swr';
import { ProjectDTO } from '../types/dto';
import { get, put } from '../utils/fetch';
import { ApiResponseType, swrToData } from '../types/swrUtil';

const projectIdEndpointURL = (id: number): string => `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`;
const projectEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/project`;

type ReturnType = {
    projectDetailResponse: ApiResponseType<ProjectDTO>;
    putProject: (project: ProjectDTO) => void;
};

function useProjectDetail(id: number): ReturnType {
    const { mutate } = useSWRConfig();

    const projectDetailResponse = swrToData(useSWR<ProjectDTO, Error>(projectIdEndpointURL(id), get));
    const putProject = async (project: ProjectDTO) => {
        const response = await put(projectEndpointURL, project);
        mutate(projectIdEndpointURL(id));
        return response;
    };
    return { projectDetailResponse, putProject };
}

export default useProjectDetail;
