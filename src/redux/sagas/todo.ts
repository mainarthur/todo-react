import {
  put,
  takeEvery,
} from 'redux-saga/effects'

import { api } from '../../api/api'
import DeleteManyBody from '../../api/bodies/DeleteManyBody'
import NewToDoBody from '../../api/bodies/NewToDoBody'
import UpdateToDoBody from '../../api/bodies/UpdateToDoBody'
import DeleteManyResponse from '../../api/responses/DeleteManyResponse'
import NewToDoResponse from '../../api/responses/NewToDoResponse'
import ToDoListResponse from '../../api/responses/ToDoListResponse'
import UpdateToDoResponse from '../../api/responses/UpdateToDoResponse'
import ToDo from '../../models/ToDo'
import { LoadingPart } from '../../common/constants'
import {
  addToDoAction,
  deleteToDosAction,
  setLoadingPartAction,
  setTodosAction,
  storeNewToDoAction,
  storeToDoUpdateAction,
  updateToDoAction,
} from '../actions/toDoActions'
import { ToDoAction } from '../constants'
import AsyncAction from '../types/AsyncAction'
import BoardPayload from '../types/payloads/BoardPayload'
import { connectDB, getDatabaseName } from '../../indexeddb/connect'
import Database from '../../indexeddb/Database'
import BodyPayload from '../types/payloads/BodyPayload'
import { getSocket } from '../../socket.io'
import Action from '../types/Action'

const getLastUpdateFieldName = (boardId: string) => `lastUpdate-todos-${boardId}`

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
    endpoint: `/todo?boardId=${boardId}${localStorage.getItem(lastUpdateField) ? `&from=${localStorage.getItem(lastUpdateField)}` : ''}`,
  })

  try {
    if (todosResponse.status) {
      const { results: loadedTodos } = todosResponse
      const currentLastUpdate: number = parseInt(localStorage.getItem(lastUpdateField), 10)
      let maxLastUpdate = 0
      const db: Database = yield connectDB(getDatabaseName(user.id, boardId))

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

        const store = db.getStore()

        if (!toDo.deleted) {
          promises.push(store.put(toDo))
        } else {
          promises.push(store.delete(toDo.id))
        }
      }

      yield Promise.all(promises)

      localStorage.setItem(lastUpdateField, `${maxLastUpdate}`)

      const store = db.getStore()
      const todosRequest: ToDo[] = yield store.getAll<ToDo>()

      yield put(setTodosAction({
        boardId,
        todos: todosRequest.map((toDo) => ({ ...toDo, loadingPart: LoadingPart.NONE })),
      }))

      next(null, todosRequest)
    } else {
      next(todosResponse.error)
    }
  } catch (err) {
    return next(err)
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

  try {
    const toDoResponse: NewToDoResponse = yield api<NewToDoResponse, NewToDoBody>({
      endpoint: '/todo',
      method: 'POST',
      body,
    })

    if (toDoResponse.status) {
      const { result: newToDoToAdd } = toDoResponse

      yield put(storeNewToDoAction({
        user,
        body: newToDoToAdd,
      }))

      next(null, newToDoToAdd)
    } else {
      next(toDoResponse.error)
    }
  } catch (err) {
    next(err)
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

  const socket = getSocket()

  const lastUpdateField = getLastUpdateFieldName(boardId)

  try {
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
      const db: Database = yield connectDB(getDatabaseName(user.id, boardId))

      const store = db.getStore()
      yield Promise.all(todos.map((toDoId) => store.delete(toDoId)))
      localStorage.setItem(lastUpdateField, `${response.lastUpdate}`)

      yield put(deleteToDosAction(body))

      if (socket) {
        socket.emit('delete-todos', body)
      }
      next(null, response.lastUpdate)
    } else {
      next(response.error)
    }
  } catch (err) {
    next(err)
  }
}

function* updateToDoRequested(action: AsyncAction<ToDo, BodyPayload<UpdateToDoBody>>) {
  const {
    payload: {
      body: {
        id,
        boardId,
        done,
        text,
      },
      body,
      user,
    },
    next,
  } = action

  let loadingPart
  if (text !== undefined) {
    loadingPart = LoadingPart.TEXT
  } else if (done !== undefined) {
    loadingPart = LoadingPart.CHECKBOX
  } else {
    loadingPart = LoadingPart.DRAG_HANDLER
  }

  try {
    yield put(setLoadingPartAction({
      boardId,
      ids: [id],
      loadingPart,
    }))

    const updateResponse: UpdateToDoResponse = yield api<UpdateToDoResponse, UpdateToDoBody>({
      body,
      endpoint: '/todo/',
      method: 'PATCH',
    })

    yield put(setLoadingPartAction({
      boardId,
      ids: [id],
      loadingPart: LoadingPart.NONE,
    }))

    if (updateResponse.status) {
      const { result: updatedToDo } = updateResponse

      yield put(storeToDoUpdateAction({
        user,
        body: updatedToDo,
      }))

      next(null, updatedToDo)
    } else {
      next(updateResponse.error)
    }
  } catch (err) {
    next(err)
  }
}

function* storeNewToDo(action: Action<BodyPayload<ToDo>>) {
  const {
    payload: {
      body: toDo,
      user,
    },
  } = action
  const socket = getSocket()

  const lastUpdateField = getLastUpdateFieldName(toDo.boardId)
  const db: Database = yield connectDB(getDatabaseName(user.id, toDo.boardId))

  const store = db.getStore()
  yield store.put(toDo)

  localStorage.setItem(lastUpdateField, `${toDo.lastUpdate}`)

  yield put(addToDoAction(toDo))

  if (socket) {
    socket.emit('new-todo', toDo)
  }
}

function* storeToDoUpdate(action: Action<BodyPayload<ToDo>>) {
  const {
    payload: {
      body: toDo,
      user,
    },
  } = action
  const lastUpdateField = getLastUpdateFieldName(toDo.boardId)
  const socket = getSocket()
  const db: Database = yield connectDB(getDatabaseName(user.id, toDo.boardId))

  const store = db.getStore()
  yield store.put(toDo)

  localStorage.setItem(lastUpdateField, `${toDo.lastUpdate}`)

  yield put(updateToDoAction(toDo))

  if (socket) {
    socket.emit('update-todo', toDo)
  }
}

function* watchTodos() {
  yield takeEvery(ToDoAction.STORE_NEW_TODO, storeNewToDo)
  yield takeEvery(ToDoAction.STORE_TODO_UPDATE, storeToDoUpdate)
  yield takeEvery(ToDoAction.REQUEST_NEW_TODO, newToDoRequested)
  yield takeEvery(ToDoAction.REQUEST_TODOS, requestTodos)
  yield takeEvery(ToDoAction.REQUEST_DELETE_MANY_TODOS, deleteManyToDosRequested)
  yield takeEvery(ToDoAction.REQUEST_UPDATE_TODO, updateToDoRequested)
}

export default watchTodos
