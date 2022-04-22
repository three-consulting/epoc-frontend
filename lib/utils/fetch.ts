import { getAuth, User } from "firebase/auth"

async function http<T>(
    path: string,
    user: User,
    config?: RequestInit
): Promise<T> {
    const jwt = await user.getIdToken()
    const request = new Request(path, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        },
        ...config,
    })
    const response = await fetch(request)

    if (!response.ok) {
        const message = `Status: ${response.status}. Message: ${response.statusText}`
        throw new Error(message)
    }

    return response.json().catch(() => ({}))
}

export function get<T>(
    path: string,
    user: User,
    params?: Record<string, string | number>,
    config?: RequestInit
): Promise<T> {
    const url = new URL(path)
    url.search = new URLSearchParams(
        params as Record<string, string>
    ).toString()
    const init = { method: "get", ...config }
    return http<T>(url.href, user, init)
}

export function post<T, U>(
    path: string,
    user: User,
    body: T,
    params?: Record<string, string | number>,
    config?: RequestInit
): Promise<U> {
    const init = {
        method: "post",
        body: JSON.stringify(body),
        ...config,
    }
    const url = new URL(path)
    url.search = new URLSearchParams(
        params as Record<string, string>
    ).toString()
    return http<U>(path, user, init)
}

export function put<T, U>(
    path: string,
    user: User,
    body: T,
    config?: RequestInit
): Promise<U> {
    const init = {
        method: "put",
        body: JSON.stringify(body),
        ...config,
    }
    return http<U>(path, user, init)
}

// delete is a reserved keyword
export function del<T>(
    path: string,
    user: User,
    config?: RequestInit
): Promise<T> {
    const init = {
        method: "delete",
        ...config,
    }
    return http<T>(path, user, init)
}
