import RefreshTokenBody from './bodies/RefreshTokenBody'
import AuthResponse from './responses/AuthResponse'
import { history } from '../routing/routerHistory'

import { err } from '../logging/logger'
import call from './call'
import store from '../redux/store'
import { setAccessTokenAction, setRefreshTokenAction } from '../redux/actions/tokenActions'

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
  history.push('/login')

  return false
}
