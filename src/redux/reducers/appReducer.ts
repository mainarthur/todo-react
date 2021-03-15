import { AppAction } from '../constants'
import AppActions from '../types/appTypes'

import User from '../../models/User'

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

export default function appReducer(state = initialState, action: AppActions): AppState {
  const newState = { ...state }
  switch (action.type) {
    case AppAction.SET_USER:
      newState.user = { ...action.payload }

      return newState
    case AppAction.REQUESTED_USER:
      newState.ok = false
      newState.error = false
      newState.loading = true

      return newState
    case AppAction.REQUESTED_USER_FAILED:
      newState.ok = false
      newState.error = true
      newState.loading = false

      return newState
    case AppAction.REQUESTED_USER_SUCCEEDED:
      newState.ok = true
      newState.error = false
      newState.loading = false

      return newState
    default:
      return state
  }
}
