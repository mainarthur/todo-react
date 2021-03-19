import Board from '../../models/Board'
import { BoardAction } from '../constants'
import { createAction } from '../helpers'

export const requestBoardsAction = createAction(BoardAction.REQUEST_BOARDS)

export const setBoardsAction = createAction<Board[]>(BoardAction.SET_BOARDS)
