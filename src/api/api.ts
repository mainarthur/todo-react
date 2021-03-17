import Request from './Request'
import Response from './Response'

import { err } from '../logging/logger'
import call from './call'
import { refreshTokens } from './refreshTokens'

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
