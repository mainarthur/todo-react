import { ToDoAction } from '../constants'
import ToDoActions from '../types/todoTypes'

export type NewToDoState = {
  loading: boolean
  ok: boolean
  error: boolean
}

const initialState: NewToDoState = {
  loading: false,
  error: false,
  ok: false,
}

export default function newToDoReducer(state = initialState, action: ToDoActions): NewToDoState {
  const newState = { ...state }
  switch (action.type) {
    case ToDoAction.REQUESTED_NEW_TODO:
      newState.ok = false
      newState.error = false
      newState.loading = true

      return newState
    case ToDoAction.REQUESTED_NEW_TODO_FAILED:
      newState.ok = false
      newState.error = true
      newState.loading = false

      return newState
    case ToDoAction.REQUESTED_NEW_TODO_SUCCEEDED:
      newState.ok = true
      newState.error = false
      newState.loading = false

      return newState
    default:
      return state
  }
}
