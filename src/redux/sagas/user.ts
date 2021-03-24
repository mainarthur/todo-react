import {
  takeEvery,
  put,
} from 'redux-saga/effects'

import { api } from '../../api/api'
import UserResponse from '../../api/responses/UserResponse'
import User from '../../models/User'
import { setUserAction } from '../actions/appActions'
import { AppAction } from '../constants'
import AsyncAction from '../types/AsyncAction'
import UserPayload from '../types/payloads/UserPayload'

function* userRequested(action: AsyncAction<User, UserPayload>) {
  const { payload, next } = action
  const userResponse: UserResponse = yield api<UserResponse, {}>({
    endpoint: `/user${payload ? `?id=${payload.id}` : ''}`,
  })

  if (userResponse.status) {
    const { result: user } = userResponse

    next(null, user)
  } else {
    next(userResponse.error)
  }
}

function* watchUser() {
  yield takeEvery(AppAction.REQUEST_USER, userRequested)
}

export default watchUser
