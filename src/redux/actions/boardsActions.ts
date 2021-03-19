import Board from '../../models/Board'
import User from '../../models/User'
import { BoardAction } from '../constants'
import { createAction } from '../helpers'

export const requestBoardsAction = createAction<User>(BoardAction.REQUEST_BOARDS)

export const setBoardsAction = createAction<Board[]>(BoardAction.SET_BOARDS)

export const addBoardAction = createAction<Board>(BoardAction.ADD_BOARD)
