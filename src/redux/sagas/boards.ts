import { takeEvery } from 'redux-saga/effects'
import { api } from '../../api/api'
import NewBoardBody from '../../api/bodies/NewBoardBody'
import BoardsResponse from '../../api/responses/BoardsResponse'
import NewBoardResponse from '../../api/responses/NewBoardResponse'
import { connectDB, defaultStoreName, getDatabaseName } from '../../indexeddb/connect'
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
    const db: IDBDatabase = yield connectDB(getDatabaseName(user.id))

    if (!Number.isNaN(currentLastUpdate)) {
      maxLastUpdate = Math.max(currentLastUpdate, maxLastUpdate)
    }

    for (let i = 0; i < boards.length; i += 1) {
      const board = boards[i]
      const { lastUpdate } = board

      if (lastUpdate) {
        maxLastUpdate = Math.max(lastUpdate, maxLastUpdate)
      }

      const transaction = db.transaction(defaultStoreName, 'readwrite')
      const store = transaction.objectStore(defaultStoreName)

      if (!board.deleted) {
        store.put(board)
      } else {
        store.delete(board.id)
      }
    }

    localStorage.setItem(lastUpdateField, `${maxLastUpdate}`)

    const transaction = db.transaction(defaultStoreName, 'readwrite')
    const store = transaction.objectStore(defaultStoreName)
    const boardsRequest = store.getAll()

    boardsRequest.addEventListener('success', () => {
      const allBoards: Board[] = boardsRequest.result

      next(null, allBoards)
    })

    boardsRequest.addEventListener('error', () => {
      next(boardsRequest.error)
    })
  } else {
    next(boardsResponse.error)
  }
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

    const db: IDBDatabase = yield connectDB(getDatabaseName(user.id))

    const transaction = db.transaction(defaultStoreName, 'readwrite')
    const store = transaction.objectStore(defaultStoreName)
    store.put(board)

    localStorage.setItem(lastUpdateField, `${board.lastUpdate}`)

    next(null, board)
  } else {
    next(boardResponse.error)
  }
}

function* watchBoards() {
  yield takeEvery(BoardAction.REQUEST_BOARDS, requestBoards)
  yield takeEvery(BoardAction.REQUEST_NEW_BOARD, requestNewBoard)
}

export default watchBoards
