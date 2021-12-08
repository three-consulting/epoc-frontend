import useSWR from 'swr';
import * as fetch from '../utils/fetch';
import { useUser } from '@/lib/hooks/useAuth';

type DataResponse<T> = {
    data?: T;
    isLoading: boolean;
    isError?: Error;
};

function useData<T>(endpoint: string, queryParams?: Record<string, string>): DataResponse<T> {
    const url = new URL(endpoint, process.env.NEXT_PUBLIC_API_URL);
    url.search = new URLSearchParams(queryParams).toString();
    const idJwt = useUser()?.getSignInUserSession()?.getIdToken().getJwtToken();

    const { data, error } = useSWR<T, Error>(url.href, (url) => fetch.get(url, undefined, idJwt));
    return { data, isLoading: !data && !error, isError: error };
}

export default useData;
