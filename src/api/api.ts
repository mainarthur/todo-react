import Console from '../logging/Console'
import { history } from '../routing/RouterContext'
import RefreshTokenBody from './bodies/RefreshTokenBody'
import Request from './Request'
import Response from './Response'
import AuthResponse from './responses/AuthResponse'

const API_URL: string = 'http://api.todolist.local'

async function call<B>(opts: Request<B>): Promise<globalThis.Response> {
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
  } catch (err) {
    Console.err(err)
    throw err
  }
}

export const refreshTokens = async (): Promise<boolean> => {
  const authResponse = await call<RefreshTokenBody>({
    endpoint: '/auth/refresh-token',
    method: 'POST',
    body: {
      refresh_token: localStorage.getItem('refresh_token'),
    },
  })

  if (authResponse.status === 200) {
    const authData = await authResponse.json()

    localStorage.setItem('access_token', (authData as AuthResponse).access_token)
    localStorage.setItem('refresh_token', (authData as AuthResponse).refresh_token)

    return true
  }

  localStorage.clear()
  history.push('/login')

  return false
}

export const api = async <T extends Response, B>(opts: Request<B>): Promise<T | Response> => {
  try {
    const response = await call<B>(opts)

    if (response.status === 401) {
      if (await refreshTokens()) {
        return await api<T, B>(opts)
      }
      return { error: 'tokens error', status: false }
    }
    return await response.json()
  } catch (err) {
    Console.err(err)
    return { error: err, status: false }
  }
}
