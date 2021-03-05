import ToDo from '../../models/ToDo'
import { ToDoAction } from '../constants'
import ToDoActions from '../types/todoTypes'

export type TodosState = ToDo[]

const initialState: TodosState = []

export default function todosReducer(state = initialState, action: ToDoActions): TodosState {
  let newState = [...state]
  switch (action.type) {
    case ToDoAction.ADD_TODO:
      newState = newState.concat([{ ...action.payload }])

      return newState
    case ToDoAction.SET_TODOS:
      newState = [...action.payload]

      return newState
    default:
      return state
  }
}
