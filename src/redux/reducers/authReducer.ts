import { AuthAction, AuthTypes } from '../constants'
import AuthActions from '../types/authActions'

export type AuthState = {
  [AuthTypes.LOGIN]: {
    ok: boolean,
    loading: boolean,
    error: boolean,
  },
  [AuthTypes.REGISTRATION]: {
    ok: boolean,
    loading: boolean,
    error: boolean,
  },
}

const initialState: AuthState = {
  [AuthTypes.LOGIN]: {
    loading: false,
    error: false,
    ok: false,
  },
  [AuthTypes.REGISTRATION]: {
    loading: false,
    error: false,
    ok: false,
  },
}

export default function authReducer(state = initialState, action: AuthActions): AuthState {
  const newState = {
    [AuthTypes.LOGIN]: { ...state[AuthTypes.LOGIN] },
    [AuthTypes.REGISTRATION]: { ...state[AuthTypes.REGISTRATION] },
  }
  switch (action.type) {
    case AuthAction.CLEAR_STATE:
      newState[action.authType] = { ...initialState[action.authType] }
      return newState
    case AuthAction.REQUESTED_AUTH:
      newState[action.authType].ok = false
      newState[action.authType].error = false
      newState[action.authType].loading = true

      return newState
    case AuthAction.REQUESTED_AUTH_FAILED:
      newState[action.authType].ok = false
      newState[action.authType].error = true
      newState[action.authType].loading = false

      return newState
    case AuthAction.REQUESTED_AUTH_SUCCEEDED:
      newState[action.authType].ok = true
      newState[action.authType].error = false
      newState[action.authType].loading = false

      return newState
    default:
      return state
  }
}
