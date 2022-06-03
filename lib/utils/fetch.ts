import { User } from "firebase/auth"

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

export const pathToUrl = (
    path: string,
    params?: Record<string, string | number>
): URL => {
    const url = new URL(path)
    url.search = new URLSearchParams(
        params as Record<string, string>
    ).toString()
    return url
}

export function get<T>(
    path: string,
    user: User,
    params?: Record<string, string | number>,
    config?: RequestInit
): Promise<T> {
    const url = pathToUrl(path, params)
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
    const url = pathToUrl(path, params)
    return http<U>(url.href, user, init)
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
    const url = pathToUrl(path, {})
    return http<U>(url.href, user, init)
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
    const url = pathToUrl(path, {})
    return http<T>(url.href, user, init)
}
