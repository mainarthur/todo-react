import { takeEvery, put } from 'redux-saga/effects'
import { api } from '../../api/api'
import NewBoardBody from '../../api/bodies/NewBoardBody'
import BoardsResponse from '../../api/responses/BoardsResponse'
import NewBoardResponse from '../../api/responses/NewBoardResponse'
import { connectDB, getDatabaseName } from '../../indexeddb/connect'
import Database from '../../indexeddb/Database'
import Board from '../../models/Board'
import User from '../../models/User'
import { addBoardAction, setBoardsAction } from '../actions/boardsActions'
import { BoardAction } from '../constants'
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

      const db: Database = yield connectDB(getDatabaseName(user.id))

      const store = db.getStore()
      yield store.put(board)

      localStorage.setItem(lastUpdateField, `${board.lastUpdate}`)

      yield put(addBoardAction(board))

      next(null, board)
    } else {
      next(boardResponse.error)
    }
  } catch (err) {
    next(err)
  }
}

function* watchBoards() {
  yield takeEvery(BoardAction.REQUEST_BOARDS, requestBoards)
  yield takeEvery(BoardAction.REQUEST_NEW_BOARD, requestNewBoard)
}

export default watchBoards
