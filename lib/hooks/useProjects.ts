import useSWR from 'swr';
import { Project } from '../types/common';
import fetcher from '../utils/fetcher';

interface ProjectResponse {
    projects?: Project[];
    isLoading: boolean;
    isError: any;
}

function useProjects(): ProjectResponse {
    const endpoint = process.env.NEXT_PUBLIC_API_URL + '/project';
    const { data: projects, error } = useSWR<Project[]>(endpoint, fetcher);

    return { projects, isLoading: !projects && !error, isError: error };
}

export default useProjects;
