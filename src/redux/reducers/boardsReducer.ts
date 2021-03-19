import ToDo from '../../models/ToDo'
import Action from '../types/Action'
import { addToDoAction, setLoadingPartAction, setTodosAction } from '../actions/toDoActions'
import Board from '../../models/Board'
import todosReducer from './todosReducer'
import { setBoardsAction } from '../actions/boardsActions'

export type BoardsState = Array<Board & { todos?: ToDo[] }>

const initialState: BoardsState = []

export default function boardsReducer(state = initialState, action: Action): BoardsState {
  let newState = [...state]

  if (setBoardsAction.match(action)) {
    newState = [...action.payload]
  }

  if (addToDoAction.match(action)) {
    newState = newState.map((board) => {
      const { _id: boardId } = board
      if (action.payload.boardId === boardId) {
        const newBoard = { ...board, todos: todosReducer(board.todos, action) }

        return newBoard
      }
      return board
    })
  }

  if (setTodosAction.match(action)) {
    newState = newState.map((board) => {
      const { _id: boardId } = board
      if (action.payload.boardId === boardId) {
        const newBoard = { ...board, todos: todosReducer(board.todos, action) }

        return newBoard
      }
      return board
    })
  }

  if (setLoadingPartAction.match(action)) {
    newState = newState.map((board) => {
      const { _id: boardId } = board
      if (action.payload.boardId === boardId) {
        const newBoard = { ...board, todos: todosReducer(board.todos, action) }

        return newBoard
      }
      return board
    })
  }

  return newState
}
