// https://eckertalex.dev/blog/typescript-fetch-wrapper
async function http<T>(path: string, config?: RequestInit): Promise<T> {
    const request = new Request(path, { headers: { 'Content-Type': 'application/json' }, ...config });
    const response = await fetch(request);

    if (!response.ok) {
        const message = `Status: ${response.status}. Message: ${response.statusText}`;
        throw new Error(message);
    }

    return response.json().catch(() => ({}));
}

export async function get<T>(path: string, config?: RequestInit): Promise<T> {
    const init = { method: 'get', ...config };
    return await http<T>(path, init);
}

export async function post<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
    const init = {
        method: 'post',
        body: JSON.stringify(body),
        ...config,
    };
    return await http<U>(path, init);
}

export async function put<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
    const init = {
        method: 'put',
        body: JSON.stringify(body),
        ...config,
    };
    return await http<U>(path, init);
}

// delete is a reserved keyword
export async function del<T>(path: string, config?: RequestInit): Promise<T> {
    const init = { method: 'delete', ...config };
    return await http<T>(path, init);
}
