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
import { LoadingPart } from '../../common/constants'
import { setLoadingPartAction } from '../actions/toDoActions'
import { ToDoAction } from '../constants'
import AsyncAction from '../types/AsyncAction'
import BoardPayload from '../types/payloads/BoardPayload'
import DeleteToDoPayload from '../types/payloads/DeleteToDoPayload'

const getLastUpdateFieldName = (boardId: string) => `lastUpdate-todos-${boardId}`

function* requestTodos(action: AsyncAction<ToDo[], BoardPayload>) {
  const {
    payload: {
      boardId,
    },
    next,
  } = action

  const lastUpdateField = getLastUpdateFieldName(boardId)

  const todosResponse: ToDoListResponse = yield api<ToDoListResponse, {}>({
    endpoint: `/todo?boardId=${boardId}${localStorage.getItem(lastUpdateField) ? `&from=${lastUpdateField}` : ''}`,
  })

  if (todosResponse.status) {
    const { results: loadedTodos } = todosResponse
    const currentLastUpdate: number = parseInt(localStorage.getItem(lastUpdateField), 10)
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

    localStorage.setItem(lastUpdateField, `${maxLastUpdate}`)

    next(null, loadedTodos)
  } else {
    next(todosResponse.error)
  }
}

function* newToDoRequested(action: AsyncAction<ToDo, NewToDoBody>) {
  const {
    next,
    payload,
    payload: {
      boardId,
    },
  } = action

  const lastUpdateField = getLastUpdateFieldName(boardId)

  const toDoResponse: NewToDoResponse = yield api<NewToDoResponse, NewToDoBody>({
    endpoint: '/todo',
    method: 'POST',
    body: payload,
  })

  if (toDoResponse.status) {
    const { result: newToDoToAdd } = toDoResponse

    localStorage.setItem(lastUpdateField, `${newToDoToAdd.lastUpdate}`)

    next(null, newToDoToAdd)
  } else {
    next(toDoResponse.error)
  }
}

function* deleteManyToDosRequested(action: AsyncAction<number, DeleteManyBody>) {
  const {
    payload,
    payload: {
      boardId,
    },
    next,
  } = action

  const lastUpdateField = getLastUpdateFieldName(boardId)

  yield put(setLoadingPartAction({
    ids: payload.todos,
    loadingPart: LoadingPart.DELETE_BUTTON,
    boardId: payload.boardId,
  }))

  const response: DeleteManyResponse = yield api<DeleteManyResponse, DeleteManyBody>({
    endpoint: '/todo/',
    method: 'DELETE',
    body: payload,
  })

  yield put(setLoadingPartAction({
    ids: payload.todos,
    loadingPart: LoadingPart.NONE,
    boardId: payload.boardId,
  }))

  if (response.status) {
    localStorage.setItem(lastUpdateField, `${response.lastUpdate}`)

    next(null, response.lastUpdate)
  } else {
    next(response.error)
  }
}

function* updateToDoRequested(action: AsyncAction<ToDo, UpdateToDoBody>) {
  const {
    payload: {
      boardId,
      _id: toDoId,
      done,
    },
    payload,
    next,
  } = action

  yield put(setLoadingPartAction({
    boardId,
    ids: [toDoId],
    loadingPart: done !== undefined ? LoadingPart.CHECKBOX : LoadingPart.DRAG_HANDLER,
  }))

  const response: UpdateToDoResponse = yield api<UpdateToDoResponse, UpdateToDoBody>({
    endpoint: '/todo/',
    method: 'PATCH',
    body: payload,
  })

  yield put(setLoadingPartAction({
    boardId,
    ids: [toDoId],
    loadingPart: LoadingPart.NONE,
  }))

  if (response.status) {
    next(null, response.result)
  } else {
    next(response.error)
  }
}

function* deleteToDoRequested(action: AsyncAction<ToDo, DeleteToDoPayload & BoardPayload>) {
  const {
    payload: {
      toDoId,
      boardId,
    },
    next,
  } = action

  yield put(setLoadingPartAction({
    boardId,
    ids: [toDoId],
    loadingPart: LoadingPart.DELETE_BUTTON,
  }))

  const response: DeleteResponse = yield api<DeleteResponse, {}>({
    endpoint: `/todo/${toDoId}`,
    method: 'DELETE',
  })

  yield put(setLoadingPartAction({
    boardId,
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
