import { history } from "../routing/RouterContext"
import { RefreshTokenBody } from "./bodies/RefreshTokenBody"
import Request from "./Request"
import Response from "./Response"
import { AuthResponse } from "./responses/AuthResponse"

const API_URL: string = 'http://api.todolist.local'


export const api = async <T extends Response, B>(opts: Request<B>): Promise<T | Response> => {
    let { endpoint: url, method, body, headers } = opts

    if (!method) {
        method = "GET"
    }

    if (!headers) {
        headers = {}
    }

    if (localStorage.getItem("access_token")) {
        headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`
    }

    const controller = new AbortController()

    try {
        const res = await fetch(`${API_URL}${url}`, {
            method: method.toUpperCase(),
            signal: controller.signal,
            body: typeof body === 'object' ? JSON.stringify(body) : undefined,
            mode: 'cors',
            headers: {
                'Content-type': 'application/json',
                ...headers
            }
        })
        if (res.status == 401) {
            if (await refreshTokens()) {
                return await api(opts)
            } else {
                return {error: "tokens error", status: false}
            }
        }
        return await res.json()
    } catch (err) {
        return { error: err, status: false }
    } finally {
        controller.abort()
    }
}

export const refreshTokens = async (): Promise<boolean> => {
    const tokens = await api<AuthResponse, RefreshTokenBody>({
        endpoint: "/auth/refresh-tokens",
        method: "POST",
        body: {
            refresh_token: localStorage.getItem("refresh_token")
        }
    })

    if (tokens instanceof AuthResponse && tokens.status) {
        localStorage.setItem("access_token", tokens.access_token)
        localStorage.setItem("refresh_token", tokens.refresh_token)

        return true
    }

    localStorage.clear()
    history.push("/login")

    return false
}