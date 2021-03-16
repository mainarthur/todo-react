import ToDo from '../../models/ToDo'
import Action from '../types/Action'
import { addToDoAction, setTodosAction } from '../actions/toDoActions'

export type TodosState = ToDo[]

const initialState: TodosState = []

export default function todosReducer(state = initialState, action: Action): TodosState {
  let newState = [...state]

  if (addToDoAction.match(action)) {
    newState = newState.concat([{ ...action.payload }])
  }
  if (setTodosAction.match(action)) {
    newState = [...action.payload]
  }

  return newState
}
