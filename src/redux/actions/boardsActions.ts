import NewBoardBody from '../../api/bodies/NewBoardBody'
import Board from '../../models/Board'
import User from '../../models/User'
import { BoardAction } from '../constants'
import { createAction } from '../helpers'
import BodyPayload from '../types/payloads/BodyPayload'

export const requestBoardsAction = createAction<User>(BoardAction.REQUEST_BOARDS)

export const setBoardsAction = createAction<Board[]>(BoardAction.SET_BOARDS)

export const requestNewBoardAction = createAction<BodyPayload<NewBoardBody>>(
  BoardAction.REQUEST_NEW_BOARD,
)

export const addBoardAction = createAction<Board>(BoardAction.ADD_BOARD)
