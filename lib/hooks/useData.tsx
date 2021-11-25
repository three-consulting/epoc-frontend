import useSWR from 'swr';
import * as fetch from '../utils/fetch';

type DataResponse<T> = {
    data?: T;
    isLoading: boolean;
    isError?: Error;
};

function useData<T>(endpoint: string): DataResponse<T> {
    const ep = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
    const { data: data, error } = useSWR<T, Error>(ep, fetch.get);
    return { data, isLoading: !data && !error, isError: error };
}

export default useData;
