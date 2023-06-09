import { User } from "firebase/auth"

async function httpText(path: string, user?: User): Promise<string> {
    const jwt = user && (await user.getIdToken())
    const auth = jwt
        ? {
              Authorization: `Bearer ${jwt}`,
          }
        : undefined
    const request = new Request(path, {
        headers: {
            ...auth,
            "Content-Type": "text/plain",
        },
    })
    const response = await fetch(request)
    return response.text()
}

async function httpJSON<T>(
    path: string,
    user?: User,
    config?: RequestInit
): Promise<T> {
    const jwt = user && (await user.getIdToken())
    const auth = jwt
        ? {
              Authorization: `Bearer ${jwt}`,
          }
        : undefined
    const request = new Request(path, {
        headers: {
            ...auth,
            "Content-Type": "application/json",
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

export function getText(
    path: string,
    user?: User,
    params?: Record<string, string | number>
) {
    const url = pathToUrl(path, params)
    return httpText(url.href, user)
}

export function getJSON<T>(
    path: string,
    user?: User,
    params?: Record<string, string | number>,
    config?: RequestInit
): Promise<T> {
    const url = pathToUrl(path, params)
    const init = { method: "get", ...config }
    return httpJSON<T>(url.href, user, init)
}

export function post<T, U>(
    path: string,
    body: T,
    user?: User,
    params?: Record<string, string | number>,
    config?: RequestInit
): Promise<U> {
    const init = {
        method: "post",
        body: JSON.stringify(body),
        ...config,
    }
    const url = pathToUrl(path, params)
    return httpJSON<U>(url.href, user, init)
}

export function put<T, U>(
    path: string,
    body: T,
    user?: User,
    config?: RequestInit
): Promise<U> {
    const init = {
        method: "put",
        body: JSON.stringify(body),
        ...config,
    }
    const url = pathToUrl(path, {})
    return httpJSON<U>(url.href, user, init)
}

// delete is a reserved keyword
export function del<T>(
    path: string,
    user?: User,
    config?: RequestInit
): Promise<T> {
    const init = {
        method: "delete",
        ...config,
    }
    const url = pathToUrl(path, {})
    return httpJSON<T>(url.href, user, init)
}
