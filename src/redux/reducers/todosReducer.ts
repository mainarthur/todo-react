import ToDo from '../../models/ToDo'
import Action from '../types/Action'
import {
  addToDoAction,
  deleteToDosAction,
  setLoadingPartAction,
  setTodosAction,
  updateToDoAction,
} from '../actions/toDoActions'
import { LoadingPart } from '../../common/constants'

export type TodosState = ToDo[]

const initialState: TodosState = []

export default function todosReducer(state = initialState, action: Action): TodosState {
  let newState = [...state]

  if (addToDoAction.match(action)) {
    newState = newState.concat([{ ...action.payload, loadingPart: LoadingPart.NONE }])
  }
  if (setTodosAction.match(action)) {
    newState = [...action.payload.todos]
  }
  if (setLoadingPartAction.match(action)) {
    const {
      payload: {
        ids,
        loadingPart,
      },
    } = action
    newState = newState.map((toDo) => {
      if (ids.indexOf(toDo.id) !== -1) {
        return { ...toDo, loadingPart }
      }
      return toDo
    })
  }

  if (updateToDoAction.match(action)) {
    newState = newState.map((toDo) => {
      if (toDo.id === action.payload.id) {
        return { ...action.payload, loadingPart: LoadingPart.NONE }1
      }

      return toDo
    })
  }

  if (deleteToDosAction.match(action)) {
    newState = newState.filter(({ id }: ToDo) => action.payload.todos.indexOf(id) === -1)
  }

  return newState
}
