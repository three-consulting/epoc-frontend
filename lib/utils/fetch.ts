import { Auth } from "aws-amplify"

async function http<T>(path: string, config?: RequestInit): Promise<T> {
    const authSession = await Auth.currentSession()
    const jwt = authSession.getIdToken()?.getJwtToken()
    const request = new Request(path, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        ...config,
    })
    const response = await fetch(request)

    if (!response.ok) {
        const message = `Status: ${response.status}. Message: ${response.statusText}`
        throw new Error(message)
    }

    return response.json().catch(() => ({}))
}

export async function get<T>(path: string, params?: Record<string, string | number>, config?: RequestInit): Promise<T> {
    const url = new URL(path)
    url.search = new URLSearchParams(params as Record<string, string>).toString()
    const init = { method: "get", ...config }
    return await http<T>(url.href, init)
}

export async function post<T, U>(
    path: string,
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
    url.search = new URLSearchParams(params as Record<string, string>).toString()
    return await http<U>(path, init)
}

export async function put<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
    const init = {
        method: "put",
        body: JSON.stringify(body),
        ...config,
    }
    return await http<U>(path, init)
}

// delete is a reserved keyword
export async function del<T>(path: string, config?: RequestInit): Promise<T> {
    const init = { method: "delete", ...config }
    return await http<T>(path, init)
}
