import { takeEvery } from 'redux-saga/effects'
import { api } from '../../api/api'
import NewBoardBody from '../../api/bodies/NewBoardBody'
import BoardsResponse from '../../api/responses/BoardsResponse'
import NewBoardResponse from '../../api/responses/NewBoardResponse'
import { connectDB, defaultStoreName, getDatabaseName } from '../../indexeddb/connect'
import Database from '../../indexeddb/Database'
import Board from '../../models/Board'
import User from '../../models/User'
import { BoardAction } from '../constants'
import AsyncAction from '../types/AsyncAction'
import NewBoardPayload from '../types/payloads/NewBoardPayload'

const lastUpdateField = 'lastUpdate-boards'

function* requestBoards(action: AsyncAction<Board[], User>) {
  const {
    next,
    payload: user,
  } = action

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

      const store = db.getStore(defaultStoreName)

      if (!board.deleted) {
        promises.push(store.put(board))
      } else {
        promises.push(store.delete(board.id))
      }
    }

    try {
      yield Promise.all(promises)
    } catch (err) {
      return next(err)
    }

    localStorage.setItem(lastUpdateField, `${maxLastUpdate}`)

    try {
      const store = db.getStore(defaultStoreName)
      const allBoards: Board[] = yield store.getAll()

      next(null, allBoards)
    } catch (err) {
      next(err)
    }
  } else {
    next(boardsResponse.error)
  }

  return null
}

function* requestNewBoard(action: AsyncAction<Board, NewBoardPayload>) {
  const {
    next,
    payload: {
      body,
      user,
    },
  } = action

  const boardResponse: NewBoardResponse = yield api<NewBoardResponse, NewBoardBody>({
    body,
    endpoint: '/board',
    method: 'POST',
  })

  if (boardResponse.status) {
    const { result: board } = boardResponse

    const db: Database = yield connectDB(getDatabaseName(user.id))

    const store = db.getStore(defaultStoreName)
    try {
      yield store.put(board)

      localStorage.setItem(lastUpdateField, `${board.lastUpdate}`)

      next(null, board)
    } catch (err) {
      next(err)
    }
  } else {
    next(boardResponse.error)
  }
}

function* watchBoards() {
  yield takeEvery(BoardAction.REQUEST_BOARDS, requestBoards)
  yield takeEvery(BoardAction.REQUEST_NEW_BOARD, requestNewBoard)
}

export default watchBoards
