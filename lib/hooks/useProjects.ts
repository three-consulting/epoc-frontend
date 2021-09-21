import useSWR from 'swr';
import { components } from '../types/api';
import fetcher from '../utils/fetcher';

interface ProjectResponse {
    projects?: components['schemas']['Project'][];
    isLoading: boolean;
    isError: any;
}

function useProjects(): ProjectResponse {
    const endpoint = process.env.NEXT_PUBLIC_API_URL + '/project';
    const { data: projects, error } = useSWR<components['schemas']['Project'][]>(endpoint, fetcher);

    return { projects, isLoading: !projects && !error, isError: error };
}

export default useProjects;
