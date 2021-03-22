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

function* userRequested(action: AsyncAction<User>) {
  const userResponse: UserResponse = yield api<UserResponse, {}>({
    endpoint: '/user',
  })

  if (userResponse.status) {
    const { result: user } = userResponse
    yield put(setUserAction(user))
    action.next(null, userResponse.result)
  } else {
    action.next(userResponse.error)
  }
}

function* watchUser() {
  yield takeEvery(AppAction.REQUEST_USER, userRequested)
}

export default watchUser
