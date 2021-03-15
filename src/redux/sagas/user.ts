import {
  put,
  takeEvery,
} from 'redux-saga/effects'

import { api } from '../../api/api'
import UserResponse from '../../api/responses/UserResponse'
import { setUserAction, userSucceededAction, userFailedAction } from '../actions/appActions'
import { AppAction } from '../constants'

function* userRequested() {
  const userResponse: UserResponse = yield api<UserResponse, {}>({
    endpoint: '/user',
  })

  if (userResponse.status) {
    yield put(setUserAction(userResponse.result))
    yield put(userSucceededAction())
  } else {
    yield put(userFailedAction())
  }
}

function* watchUser() {
  yield takeEvery(AppAction.REQUESTED_USER, userRequested)
}

export default watchUser
