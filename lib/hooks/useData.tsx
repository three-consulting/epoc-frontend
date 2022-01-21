import useSWR from 'swr';
import * as fetch from '../utils/fetch';

type DataResponse<T> = {
    data?: T;
    isLoading: boolean;
    isError?: Error;
};

function useData<T>(endpoint: URL, queryParams?: Record<string, string>): DataResponse<T> {
    endpoint.search = new URLSearchParams(queryParams).toString();
    const { data, error } = useSWR<T, Error>(endpoint.href, fetch.get);
    return { data, isLoading: !data && !error, isError: error };
}

export default useData;
