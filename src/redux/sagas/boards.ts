import { takeEvery } from 'redux-saga/effects'
import { api } from '../../api/api'
import BoardsResponse from '../../api/responses/BoardsResponse'
import Board from '../../models/Board'
import { BoardAction } from '../constants'
import AsyncAction from '../types/AsyncAction'

function* requestBoards(action: AsyncAction<Board[]>) {
  const {
    next,
  } = action

  const boardsResponse: BoardsResponse = yield api<BoardsResponse, {}>({
    endpoint: '/boards',
  })

  if (boardsResponse.status) {
    const { results: boards } = boardsResponse

    next(null, boards)
  } else {
    next(boardsResponse.error)
  }
}

function* watchBoards() {
  yield takeEvery(BoardAction.REQUEST_BOARDS, requestBoards)
}

export default watchBoards
