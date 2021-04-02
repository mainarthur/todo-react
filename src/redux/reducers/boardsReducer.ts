import ToDo from '../../models/ToDo'
import Action from '../types/Action'
import {
  addToDoAction,
  deleteToDosAction,
  setLoadingPartAction,
  setTodosAction,
  updateToDoAction,
} from '../actions/toDoActions'
import Board from '../../models/Board'
import todosReducer from './todosReducer'
import {
  addBoardAction,
  deleteBoardAction,
  setBoardsAction,
  updateBoardAction,
} from '../actions/boardsActions'
import * as R from 'ramda'

export type BoardsState = Array<Board & { todos?: ToDo[] }>

const initialState: BoardsState = []

const deleteBoard = (boards: BoardsState, id: string) => R.filter(R.pipe(R.propEq('id', id), R.not))(boards)
const addBoard = (
  boards: BoardsState,
  boardToAdd: Board,
) => R.append(boardToAdd)(boards)



export default function boardsReducer(state = initialState, action: Action): BoardsState {
  let newState = [...state]

  if (addBoardAction.match(action)) {
    newState = addBoard(newState, action.payload)
  }

  if (setBoardsAction.match(action)) {
    newState = newState.map((board) => ({ ...board, todos: board.todos ?? [] }))
  }

  if (deleteBoardAction.match(action)) {
    newState = deleteBoard(newState, action.payload.id)
  }

  if (updateBoardAction.match(action)) {
    newState = newState.map((board) => {
      if (board.id === action.payload.id) {
        return { ...action.payload, todos: board.todos ?? [] }
      }
      return board
    })
  }

  if (
    addToDoAction.match(action)
    || setTodosAction.match(action)
    || setLoadingPartAction.match(action)
    || deleteToDosAction.match(action)
    || updateToDoAction.match(action)
  ) {
    newState = newState.map((board) => {
      const { id: boardId } = board
      if (action.payload.boardId === boardId) {
        const newBoard = { ...board, todos: todosReducer(board.todos, action) }

        return newBoard
      }
      return board
    })
  }

  return newState
}
