import {
  put,
  takeEvery,
  call,
} from 'redux-saga/effects'

import { api } from '../../api/api'
import { AppAction } from '../constants'

function* userRequested() {

}

function* watchUser() {
  yield takeEvery(AppAction.REQUESTED_USER, userRequested)
}

export default watchUser
