import { useFocusOnPointerDown } from '@chakra-ui/hooks';
import useSWR from 'swr';
import * as fetch from '../utils/fetch';

interface ProjectResponse<T> {
    projects?: T;
    isLoading: boolean;
    isError?: Error;
}

function useProjects<T>(id?: string | string[] | undefined): ProjectResponse<T> {
    const endpoint = id
        ? `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/project`;
    const { data: projects, error } = useSWR<T, Error>(endpoint, fetch.get);

    return { projects, isLoading: !projects && !error, isError: error };
}

export default useProjects;
