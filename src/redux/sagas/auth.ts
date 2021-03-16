import {
  put,
  takeEvery,
  delay,
} from 'redux-saga/effects'

import { api } from '../../api/api'
import AuthBody from '../../api/bodies/AuthBody'
import AuthResponse from '../../api/responses/AuthResponse'
import { setAccessTokenAction, setRefreshTokenAction } from '../actions/tokenActions'
import { AuthAction } from '../constants'
import AsyncAction from '../types/AsyncAction'

function* authRequested(action: AsyncAction<{}, AuthBody>) {
  const {
    payload,
    type,
    next,
  } = action
  yield delay(1000)
  const endpoint = type === AuthAction.REQUESTED_REGISTER ? '/register' : '/login'
  const authResponse: AuthResponse = yield api<AuthResponse, AuthBody>({
    endpoint: `/auth${endpoint}`,
    method: 'POST',
    body: payload,
  })

  if (authResponse.status) {
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
    } = authResponse

    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)

    yield put(setAccessTokenAction(accessToken))
    yield put(setRefreshTokenAction(refreshToken))
    next()
  } else {
    next(authResponse.error)
  }
}

function* watchAuth() {
  yield takeEvery(AuthAction.REQUESTED_LOGIN, authRequested)
  yield takeEvery(AuthAction.REQUESTED_REGISTER, authRequested)
}

export default watchAuth
