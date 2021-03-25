import AddUserToBoardBody from '../../api/bodies/AddUserToBoardBody'
import DeleteBoardBody from '../../api/bodies/DeleteBoardBody'
import NewBoardBody from '../../api/bodies/NewBoardBody'
import UpdateBoardBody from '../../api/bodies/UpdateBoardBody'
import Board from '../../models/Board'
import User from '../../models/User'
import { BoardAction } from '../constants'
import { createAction } from '../helpers'
import BodyPayload from '../types/payloads/BodyPayload'

export const setBoardsAction = createAction<Board[]>(BoardAction.SET_BOARDS)
export const addBoardAction = createAction<Board>(BoardAction.ADD_BOARD)
export const updateBoardAction = createAction<Board>(BoardAction.UPDATE_BOARD)
export const deleteBoardAction = createAction<Board>(BoardAction.DELETE_BOARD)

export const requestNewBoardAction = createAction<BodyPayload<NewBoardBody>>(
  BoardAction.REQUEST_NEW_BOARD,
)
export const requestBoardsAction = createAction<User>(BoardAction.REQUEST_BOARDS)
export const requestDeleteBoard = createAction<BodyPayload<DeleteBoardBody>>(
  BoardAction.REQUEST_DELETE_BOARD,
)
export const requestUpdateBoardAction = createAction<BodyPayload<UpdateBoardBody>>(
  BoardAction.REQUEST_UPDATE_BOARD,
)

export const requestAddUserToBoardAction = createAction<BodyPayload<AddUserToBoardBody>>(
  BoardAction.REQUEST_ADD_USER_TO_BOARD,
)

export const storeNewBoardAction = createAction<BodyPayload<Board>>(BoardAction.STORE_NEW_BOARD)
export const storeUpdatedBoardAction = createAction<BodyPayload<Board>>(
  BoardAction.STORE_UPDATED_BOARD,
)
export const deleteStoredBoardAction = createAction<BodyPayload<Board>>(
  BoardAction.DELETE_STORED_BOARD,
)
