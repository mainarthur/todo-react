import {
  put,
  takeEvery,
  delay,
} from 'redux-saga/effects'

import { api } from '../../api/api'
import AuthBody from '../../api/bodies/AuthBody'
import AuthResponse from '../../api/responses/AuthResponse'
import { authFailedAction, authSucceededAction } from '../actions/authActions'
import { setAccessTokenAction, setRefreshTokenAction } from '../actions/tokenActions'
import { AuthAction, AuthTypes } from '../constants'
import { AuthRequestAction } from '../types/authActions'

function* authRequested(action: AuthRequestAction) {
  const {
    payload,
    authType,
  } = action
  yield delay(1000)
  const endpoint = authType === AuthTypes.REGISTRATION ? '/register' : '/login'
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
    yield put(authSucceededAction(authType))
  } else {
    yield put(authFailedAction(authType))
  }
}

function* watchAuth() {
  yield takeEvery(AuthAction.REQUESTED_AUTH, authRequested)
}

export default watchAuth
