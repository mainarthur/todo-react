import Request from "./Request"
import Response from "./Response"

const API_URL: string = 'http://api.todolist.local'


export default async <T extends Response, B>(opts: Request<B>): Promise<T | Response> => {
    let { endpoint: url, method, body, headers } = opts

    if (!method) {
        method = "GET"
    }

    if (!headers) {
        headers = {}
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
        return await res.json()
    } catch (err) {
        return { error: err, status: false}
    } finally {
        controller.abort()
    }
};