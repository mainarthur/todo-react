import { takeEvery, put } from 'redux-saga/effects'
import { api } from '../../api/api'
import DeleteBoardBody from '../../api/bodies/DeleteBoardBody'
import NewBoardBody from '../../api/bodies/NewBoardBody'
import Response from '../../api/Response'
import BoardsResponse from '../../api/responses/BoardsResponse'
import DeleteBoardResponse from '../../api/responses/DeleteBoardResponse'
import NewBoardResponse from '../../api/responses/NewBoardResponse'
import { connectDB, getDatabaseName } from '../../indexeddb/connect'
import Database from '../../indexeddb/Database'
import Board from '../../models/Board'
import User from '../../models/User'
import { getSocket } from '../../socket.io'
import {
  addBoardAction,
  deleteBoardAction,
  deleteStoredBoardAction,
  setBoardsAction,
  storeNewBoardAction,
} from '../actions/boardsActions'
import { BoardAction } from '../constants'
import Action from '../types/Action'
import AsyncAction from '../types/AsyncAction'
import BodyPayload from '../types/payloads/BodyPayload'

const lastUpdateField = 'lastUpdate-boards'

function* requestBoards(action: AsyncAction<Board[], User>) {
  const {
    next,
    payload: user,
  } = action

  try {
    const boardsResponse: BoardsResponse = yield api<BoardsResponse, {}>({
      endpoint: `/board${localStorage.getItem(lastUpdateField) ? `?from=${localStorage.getItem(lastUpdateField)}` : ''}`,
    })

    if (boardsResponse.status) {
      const { results: boards } = boardsResponse
      const currentLastUpdate: number = parseInt(localStorage.getItem(lastUpdateField), 10)
      let maxLastUpdate = 0
      const db: Database = yield connectDB(getDatabaseName(user.id))

      if (!Number.isNaN(currentLastUpdate)) {
        maxLastUpdate = Math.max(currentLastUpdate, maxLastUpdate)
      }

      const promises: Promise<void>[] = []

      for (let i = 0; i < boards.length; i += 1) {
        const board = boards[i]
        const { lastUpdate } = board

        if (lastUpdate) {
          maxLastUpdate = Math.max(lastUpdate, maxLastUpdate)
        }

        const store = db.getStore()

        if (!board.deleted) {
          promises.push(store.put(board))
        } else {
          promises.push(store.delete(board.id))
        }
      }

      yield Promise.all(promises)

      localStorage.setItem(lastUpdateField, `${maxLastUpdate}`)

      const store = db.getStore()
      const allBoards: Board[] = yield store.getAll()
      yield put(setBoardsAction(allBoards))
      next(null, allBoards)
    } else {
      next(boardsResponse.error)
    }
  } catch (err) {
    return next(err)
  }
  return null
}

function* requestNewBoard(action: AsyncAction<Board, BodyPayload<NewBoardBody>>) {
  const {
    next,
    payload: {
      body,
      user,
    },
  } = action

  try {
    const boardResponse: NewBoardResponse = yield api<NewBoardResponse, NewBoardBody>({
      body,
      endpoint: '/board',
      method: 'POST',
    })

    if (boardResponse.status) {
      const { result: board } = boardResponse

      yield put(storeNewBoardAction({
        user,
        body: board,
      }))
      const socket = getSocket()

      if (socket) {
        socket.emit('new-board', board)
      }

      next(null, board)
    } else {
      next(boardResponse.error)
    }
  } catch (err) {
    next(err)
  }
}

function* requestDeleteBoard(action: AsyncAction<Board, BodyPayload<DeleteBoardBody>>) {
  const {
    next,
    payload: {
      body,
      user,
    },
  } = action

  try {
    const deleteResponse: DeleteBoardResponse = yield api<Response, DeleteBoardBody>({
      body,
      endpoint: '/board',
      method: 'DELETE',
    })

    if (deleteResponse.status) {
      const { result: board } = deleteResponse
      const socket = getSocket()

      yield put(deleteStoredBoardAction({
        user,
        body: board,
      }))

      if (socket) {
        socket.emit('delete-board', board)
      }

      next(null, board)
    } else {
      next(deleteResponse.error)
    }
  } catch (err) {
    next(err)
  }
}

function* storeNewBoard(action: Action<BodyPayload<Board>>) {
  const {
    payload: {
      body: board,
      user,
    },
  } = action
  const db: Database = yield connectDB(getDatabaseName(user.id))

  const store = db.getStore()
  yield store.put(board)

  localStorage.setItem(lastUpdateField, `${board.lastUpdate}`)

  yield put(addBoardAction(board))
}

function* deleteStoredBoard(action: Action<BodyPayload<Board>>) {
  const {
    payload: {
      body: board,
      user,
    },
  } = action

  const db: Database = yield connectDB(getDatabaseName(user.id))

  const store = db.getStore()
  yield store.delete(board.id)

  localStorage.setItem(lastUpdateField, `${board.lastUpdate}`)

  yield put(deleteBoardAction(board))
}

function* watchBoards() {
  yield takeEvery(BoardAction.DELETE_STORED_BOARD, deleteStoredBoard)
  yield takeEvery(BoardAction.STORE_NEW_BOARD, storeNewBoard)
  yield takeEvery(BoardAction.REQUEST_BOARDS, requestBoards)
  yield takeEvery(BoardAction.REQUEST_DELETE_BOARD, requestDeleteBoard)
  yield takeEvery(BoardAction.REQUEST_NEW_BOARD, requestNewBoard)
}

export default watchBoards
