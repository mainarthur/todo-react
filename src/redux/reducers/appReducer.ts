import { AppAction } from '../constants'
import AppActions from '../types/appTypes'

import User from '../../models/User'

export type AppState = {
  user: User
}

const initialState: AppState = {
  user: null,
}

export default function appReducer(state = initialState, action: AppActions): AppState {
  const newState = { ...state }
  switch (action.type) {
    case AppAction.SET_USER:
      newState.user = { ...action.payload }

      return newState
    default:
      return state
  }
}
