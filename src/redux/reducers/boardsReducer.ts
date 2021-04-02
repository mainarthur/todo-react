import * as R from 'ramda'
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

export type BoardsState = Array<Board & { todos?: ToDo[] }>

const initialState: BoardsState = []

const deleteBoard = (boards: BoardsState, id: string) => R.filter(
  R.pipe(R.propEq('id', id), R.not),
)(boards)
const addBoard = (
  boards: BoardsState,
  boardToAdd: Board,
) => R.append(boardToAdd)(boards)
const setBoards = R.map(
  R.ifElse(
    R.pipe(R.has('todos'), R.not),
    R.assoc('todos', []),
    R.identity,
  ),
)
const updateBoard = (boards: BoardsState, board: Board) => R.map(
  R.ifElse(
    R.propEq('id', board.id),
    R.mergeLeft(board),
    R.identity,
  ),
)(boards)

const updateToDos = (boards: BoardsState, boardId: string, action: Action) => R.map(
  R.ifElse(
    R.propEq('id', boardId),
    (a) => R.assoc('todos', todosReducer(R.prop('todos')(a), action))(a),
    R.identity,
  ),
)(boards)

export default function boardsReducer(state = initialState, action: Action): BoardsState {
  let newState = [...state]

  if (addBoardAction.match(action)) {
    newState = addBoard(newState, action.payload)
  }

  if (setBoardsAction.match(action)) {
    newState = setBoards(action.payload)
  }

  if (deleteBoardAction.match(action)) {
    newState = deleteBoard(newState, action.payload.id)
  }

  if (updateBoardAction.match(action)) {
    newState = updateBoard(newState, action.payload)
  }

  if (
    addToDoAction.match(action)
    || setTodosAction.match(action)
    || setLoadingPartAction.match(action)
    || deleteToDosAction.match(action)
    || updateToDoAction.match(action)
  ) {
    newState = updateToDos(newState, action.payload.boardId, action)
  }

  return newState
}
