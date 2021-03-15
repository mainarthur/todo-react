import {
  put,
  takeEvery,
} from 'redux-saga/effects'

import { api } from '../../api/api'
import NewToDoBody from '../../api/bodies/NewToDoBody'
import NewToDoResponse from '../../api/responses/NewToDoResponse'
import { addToDoAction, newToDoFailedAction, newToDoSucceededAction } from '../actions/toDoActions'
import { ToDoAction } from '../constants'
import { NewToDoRequestAction } from '../types/todoTypes'

function* newToDoRequested(action: NewToDoRequestAction) {
  const toDoResponse: NewToDoResponse = yield api<NewToDoResponse, NewToDoBody>({
    endpoint: '/todo',
    method: 'POST',
    body: action.payload,
  })

  if (toDoResponse.status) {
    const { result: newToDoToAdd } = toDoResponse

    yield put(addToDoAction(newToDoToAdd))
    yield put(newToDoSucceededAction())
  } else {
    yield put(newToDoFailedAction())
  }
}

function* watchTodos() {
  yield takeEvery(ToDoAction.REQUESTED_NEW_TODO, newToDoRequested)
}

export default watchTodos
