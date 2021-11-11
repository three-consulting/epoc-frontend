import useSWR from 'swr';
import { components } from '../types/api';
import * as fetch from '../utils/fetch';

interface ProjectResponse {
    projects?: components['schemas']['ProjectDTO'][];
    isLoading: boolean;
    isError?: Error;
}

function useProjects(): ProjectResponse {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/project`;
    const { data: projects, error } = useSWR<components['schemas']['ProjectDTO'][], Error>(endpoint, fetch.get);

    return { projects, isLoading: !projects && !error, isError: error };
}

export default useProjects;
