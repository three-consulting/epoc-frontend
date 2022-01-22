import { Auth } from 'aws-amplify';

export type ResponseWithStatus<T> = { data: T; isSuccess: true } | { isSuccess: false; errorMessage: string };

async function http<T>(path: string, config?: RequestInit): Promise<ResponseWithStatus<T>> {
    const authSession = await Auth.currentSession();
    const jwt = authSession.getIdToken()?.getJwtToken();
    const request = new Request(path, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        ...config,
    });
    return fetch(request).then(async (response) => {
        if (!response.ok) {
            const errorMessage = `Status: ${response.status}. Message: ${response.statusText}`;
            return { isSuccess: false, errorMessage: errorMessage };
        }
        const data: T = await response.json().catch(() => ({}));
        return { data: data, isSuccess: true, isError: false };
    });
}

export async function get<T>(
    path: string,
    params?: Record<string, string | number>,
    config?: RequestInit,
): Promise<ResponseWithStatus<T>> {
    const url = new URL(path, process.env.NEXT_PUBLIC_API_URL);
    url.search = new URLSearchParams(params as Record<string, string>).toString();
    const init = { method: 'get', ...config };
    return await http<T>(url.href, init);
}

export async function post<T, U>(
    path: string,
    body: T,
    params?: Record<string, string | number>,
    config?: RequestInit,
): Promise<ResponseWithStatus<U>> {
    const init = {
        method: 'post',
        body: JSON.stringify(body),
        ...config,
    };
    const url = new URL(path, process.env.NEXT_PUBLIC_API_URL);
    url.search = new URLSearchParams(params as Record<string, string>).toString();
    return await http<U>(path, init);
}

export async function put<T, U>(path: string, body: T, config?: RequestInit): Promise<ResponseWithStatus<U>> {
    const init = {
        method: 'put',
        body: JSON.stringify(body),
        ...config,
    };
    return await http<U>(path, init);
}

// delete is a reserved keyword
export async function del<T>(path: string, config?: RequestInit): Promise<ResponseWithStatus<T>> {
    const init = { method: 'delete', ...config };
    return await http<T>(path, init);
}
