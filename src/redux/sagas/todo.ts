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
import { connectDB, getDatabaseName } from '../../indexeddb/connect'
import Database from '../../indexeddb/Database'
import BodyPayload from '../types/payloads/BodyPayload'

const getLastUpdateFieldName = (boardId: string) => `lastUpdate-todos-${boardId}`
const getStoreName = (boardId: string) => `todos-${boardId}`

function* requestTodos(action: AsyncAction<ToDo[], BoardPayload>) {
  const {
    payload: {
      boardId,
      user,
    },
    next,
  } = action

  if (!user) {
    return next(new Error('User not found'))
  }

  const lastUpdateField = getLastUpdateFieldName(boardId)

  const todosResponse: ToDoListResponse = yield api<ToDoListResponse, {}>({
    endpoint: `/todo?boardId=${boardId}${localStorage.getItem(lastUpdateField) ? `&from=${lastUpdateField}` : ''}`,
  })

  if (todosResponse.status) {
    const { results: loadedTodos } = todosResponse
    const currentLastUpdate: number = parseInt(localStorage.getItem(lastUpdateField), 10)
    let maxLastUpdate = 0
    const db: Database = yield connectDB(getDatabaseName(user.id))

    if (!Number.isNaN(currentLastUpdate)) {
      maxLastUpdate = Math.max(currentLastUpdate, maxLastUpdate)
    }

    const promises: Promise<void>[] = []

    for (let i = 0; i < loadedTodos.length; i += 1) {
      const toDo = loadedTodos[i]

      const { lastUpdate } = toDo

      if (lastUpdate) {
        maxLastUpdate = Math.max(maxLastUpdate, lastUpdate)
      }

      const store = db.getStore(getStoreName(boardId))

      if (!toDo.deleted) {
        promises.push(store.put(toDo))
      } else {
        promises.push(store.delete(toDo.id))
      }
    }

    try {
      yield Promise.all(promises)
    } catch (err) {
      return next(err)
    }

    localStorage.setItem(lastUpdateField, `${maxLastUpdate}`)

    const store = db.getStore(getStoreName(boardId))
    try {
      const todosRequest = yield store.getAll<ToDo>()

      next(null, todosRequest)
    } catch (err) {
      return next(err)
    }
  } else {
    next(todosResponse.error)
  }

  return null
}

function* newToDoRequested(action: AsyncAction<ToDo, BodyPayload<NewToDoBody>>) {
  const {
    next,
    payload: {
      body,
      user,
      body: {
        boardId,
      },
    },
  } = action

  const lastUpdateField = getLastUpdateFieldName(boardId)

  const toDoResponse: NewToDoResponse = yield api<NewToDoResponse, NewToDoBody>({
    endpoint: '/todo',
    method: 'POST',
    body,
  })

  if (toDoResponse.status) {
    const { result: newToDoToAdd } = toDoResponse
    const db: Database = yield connectDB(getDatabaseName(user.id))

    const store = db.getStore(getStoreName(boardId))
    try {
      yield store.put(newToDoToAdd)

      localStorage.setItem(lastUpdateField, `${newToDoToAdd.lastUpdate}`)

      next(null, newToDoToAdd)
    } catch (err) {
      next(err)
    }
  } else {
    next(toDoResponse.error)
  }
}

function* deleteManyToDosRequested(action: AsyncAction<number, BodyPayload<DeleteManyBody>>) {
  const {
    payload: {
      body,
      body: {
        boardId,
        todos,
      },
      user,
    },
    next,
  } = action

  const lastUpdateField = getLastUpdateFieldName(boardId)

  yield put(setLoadingPartAction({
    boardId,
    ids: todos,
    loadingPart: LoadingPart.DELETE_BUTTON,
  }))

  const response: DeleteManyResponse = yield api<DeleteManyResponse, DeleteManyBody>({
    body,
    endpoint: '/todo/',
    method: 'DELETE',
  })

  yield put(setLoadingPartAction({
    boardId,
    ids: todos,
    loadingPart: LoadingPart.NONE,
  }))

  if (response.status) {
    const db: Database = yield connectDB(getDatabaseName(user.id))

    const store = db.getStore(getStoreName(boardId))
    try {
      yield Promise.all(todos.map((toDoId) => store.delete(toDoId)))
      localStorage.setItem(lastUpdateField, `${response.lastUpdate}`)

      next(null, response.lastUpdate)
    } catch (err) {
      next(err)
    }
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
