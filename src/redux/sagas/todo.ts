import {
  takeEvery,
} from 'redux-saga/effects'

import { api } from '../../api/api'
import NewToDoBody from '../../api/bodies/NewToDoBody'
import NewToDoResponse from '../../api/responses/NewToDoResponse'
import ToDo from '../../models/ToDo'
import { ToDoAction } from '../constants'
import AsyncAction from '../types/AsyncAction'

function* newToDoRequested(action: AsyncAction<ToDo, NewToDoBody>) {
  const toDoResponse: NewToDoResponse = yield api<NewToDoResponse, NewToDoBody>({
    endpoint: '/todo',
    method: 'POST',
    body: action.payload,
  })

  if (toDoResponse.status) {
    const { result: newToDoToAdd } = toDoResponse

    action.next(null, newToDoToAdd)
  } else {
    action.next(toDoResponse.error)
  }
}

function* watchTodos() {
  yield takeEvery(ToDoAction.REQUEST_NEW_TODO, newToDoRequested)
}

export default watchTodos
