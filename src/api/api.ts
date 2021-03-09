import { err } from '../logging/logger'
import { deleteTokensAction, setAccessTokenAction, setRefreshTokenAction } from '../redux/actions/tokenActions'
import store from '../redux/store'
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
  } catch (e) {
    err(e)
    throw e
  }
}

export const refreshTokens = async (): Promise<boolean> => {
  try {
    const authResponse = await call<RefreshTokenBody>({
      endpoint: '/auth/refresh-token',
      method: 'POST',
      body: {
        refresh_token: localStorage.getItem('refresh_token'),
      },
    })

    if (authResponse.status === 200) {
      const authData = await authResponse.json()
      const auth = (authData as AuthResponse)
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
      } = auth

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      store.dispatch(setAccessTokenAction(accessToken))
      store.dispatch(setRefreshTokenAction(refreshToken))

      return true
    }
  } catch (e) {
    err(e)
  }

  localStorage.clear()
  store.dispatch(deleteTokensAction())
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
  } catch (e) {
    err(e)
    return { error: e, status: false }
  }
}
