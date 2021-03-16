import User from '../../models/User'
import Action from '../types/Action'
import { setUserAction } from '../actions/appActions'

export type AppState = {
  user: User
}

const initialState: AppState = {
  user: null,
}

export default function appReducer(state = initialState, action: Action): AppState {
  const newState = { ...state }

  if (setUserAction.match(action)) {
    newState.user = { ...action.payload }
  }

  return newState
}
