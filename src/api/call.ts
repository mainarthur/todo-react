import Request from './Request'

import { err } from '../logging/logger'

const API_URL: string = 'http://api.todolist.local'

export default async function call<B>(opts: Request<B>): Promise<globalThis.Response> {
  let {
    method, headers,
  } = opts

  const {
    endpoint: url, body,
  } = opts

  if (!method) {
    method = 'GET'
  }

  if (!headers) {
    headers = {}
  }

  if (localStorage.getItem('access_token')) {
    headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
  }

  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: method.toUpperCase(),
      body: typeof body === 'object' ? JSON.stringify(body) : undefined,
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
        ...headers,
      },
    })

    return res
  } catch (e) {
    err(e)
    throw e
  }
}
