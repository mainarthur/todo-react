import {
  put,
  takeEvery,
} from 'redux-saga/effects'

import { api } from '../../api/api'
import DeleteManyBody from '../../api/bodies/DeleteManyBody'
import NewToDoBody from '../../api/bodies/NewToDoBody'
import UpdateToDoBody from '../../api/bodies/UpdateToDoBody'
import DeleteManyResponse from '../../api/responses/DeleteManyResponse'
import DeleteResponse from '../../api/responses/DeleteResponse'
import NewToDoResponse from '../../api/responses/NewToDoResponse'
import ToDoListResponse from '../../api/responses/ToDoListResponse'
import UpdateToDoResponse from '../../api/responses/UpdateToDoResponse'
import ToDo from '../../models/ToDo'
import { LoadingPart } from '../../todo/constants'
import { setLoadingPartAction } from '../actions/toDoActions'
import { ToDoAction } from '../constants'
import AsyncAction from '../types/AsyncAction'
import DeleteToDoPayload from '../types/payloads/DeleteToDoPayload'

function* requestTodos(action: AsyncAction<ToDo[]>) {
  const todosResponse: ToDoListResponse = yield api<ToDoListResponse, {}>({
    endpoint: `/todo${localStorage.getItem('lastUpdate') ? `?from=${localStorage.getItem('lastUpdate')}` : ''}`,
  })

  if (todosResponse.status) {
    const { results: loadedTodos } = todosResponse
    const currentLastUpdate: number = parseInt(localStorage.getItem('lastUpdate'), 10)
    let maxLastUpdate = 0

    if (!Number.isNaN(currentLastUpdate)) {
      maxLastUpdate = Math.max(currentLastUpdate, maxLastUpdate)
    }

    loadedTodos.forEach((toDo: ToDo) => {
      const { lastUpdate } = toDo

      if (lastUpdate) {
        maxLastUpdate = Math.max(maxLastUpdate, lastUpdate)
      }
    })

    localStorage.setItem('lastUpdate', `${maxLastUpdate}`)

    action.next(null, loadedTodos)
  } else {
    action.next(todosResponse.error)
  }
}

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

function* deleteManyToDosRequested(action: AsyncAction<number, DeleteManyBody>) {
  const {
    payload,
    next,
  } = action

  yield put(setLoadingPartAction({
    ids: payload.todos,
    loadingPart: LoadingPart.DELETE_BUTTON,
  }))

  const response: DeleteManyResponse = yield api<DeleteManyResponse, DeleteManyBody>({
    endpoint: '/todo/',
    method: 'DELETE',
    body: payload,
  })

  yield put(setLoadingPartAction({
    ids: payload.todos,
    loadingPart: LoadingPart.NONE,
  }))

  if (response.status) {
    next(null, response.lastUpdate)
  } else {
    next(response.error)
  }
}

function* updateToDoRequested(action: AsyncAction<ToDo, UpdateToDoBody>) {
  const {
    payload: {
      _id: toDoId,
      done,
    },
    payload,
    next,
  } = action

  yield put(setLoadingPartAction({
    ids: [toDoId],
    loadingPart: done !== undefined ? LoadingPart.CHECKBOX : LoadingPart.DRAG_HANDLER,
  }))

  const response: UpdateToDoResponse = yield api<UpdateToDoResponse, UpdateToDoBody>({
    endpoint: '/todo/',
    method: 'PATCH',
    body: payload,
  })

  yield put(setLoadingPartAction({
    ids: [toDoId],
    loadingPart: LoadingPart.NONE,
  }))

  if (response.status) {
    next(null, response.result)
  } else {
    next(response.error)
  }
}

function* deleteToDoRequested(action: AsyncAction<ToDo, DeleteToDoPayload>) {
  const {
    payload: {
      toDoId,
    },
    next,
  } = action

  yield put(setLoadingPartAction({
    ids: [toDoId],
    loadingPart: LoadingPart.DELETE_BUTTON,
  }))

  const response: DeleteResponse = yield api<DeleteResponse, {}>({
    endpoint: `/todo/${toDoId}`,
    method: 'DELETE',
  })

  yield put(setLoadingPartAction({
    ids: [toDoId],
    loadingPart: LoadingPart.NONE,
  }))

  if (response.status) {
    next(null, response.result)
  } else {
    next(response.error)
  }
}

function* watchTodos() {
  yield takeEvery(ToDoAction.REQUEST_NEW_TODO, newToDoRequested)
  yield takeEvery(ToDoAction.REQUEST_TODOS, requestTodos)
  yield takeEvery(ToDoAction.REQUEST_DELETE_MANY_TODOS, deleteManyToDosRequested)
  yield takeEvery(ToDoAction.REQUEST_UPDATE_TODO, updateToDoRequested)
  yield takeEvery(ToDoAction.REQUEST_DELETE_TODO, deleteToDoRequested)
}

export default watchTodos
