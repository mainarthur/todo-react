import User from '../../models/User'
import Action from '../types/Action'
import { setUserAction } from '../actions/appActions'

export type AppState = {
  loading: boolean
  ok: boolean
  error: boolean
  user: User
}

const initialState: AppState = {
  user: null,
  loading: false,
  error: false,
  ok: false,
}

export default function appReducer(state = initialState, action: Action): AppState {
  const newState = { ...state }

  if (setUserAction.match(action)) {
    newState.user = { ...action.payload }
  }

  return newState
}
