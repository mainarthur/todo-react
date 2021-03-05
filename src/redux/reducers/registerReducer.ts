import { AuthAction, AuthMethod } from '../constants'
import AuthActions from '../types/authTypes'

export type RegisterState = {
  email: string
  password: string
  name: string
  invalidEmail: boolean
  invalidName: boolean
  invalidPassword: boolean
  serverError: boolean
}

const initialState: RegisterState = {
  email: '',
  password: '',
  name: '',
  invalidName: false,
  invalidEmail: false,
  invalidPassword: false,
  serverError: false,
}

export default function registerReducer(state = initialState, action: AuthActions): RegisterState {
  if (action.method === AuthMethod.REGISTRATION) {
    const newState = { ...state }
    switch (action.type) {
      case AuthAction.CHANGE_EMAIL:
        newState.email = action.payload

        return newState
      case AuthAction.CHANGE_PASSWORD:
        newState.password = action.payload

        return newState
      case AuthAction.CHANGE_NAME:
        newState.name = action.payload

        return newState
      case AuthAction.TOGGLE_EMAIL_VALIDATION:
        newState.invalidEmail = !newState.invalidEmail

        return newState
      case AuthAction.TOGGLE_PASSWORD_VALIDATION:
        newState.invalidPassword = !newState.invalidPassword

        return newState
      case AuthAction.TOGGLE_NAME_VALIDATION:
        newState.invalidName = !newState.invalidName

        return newState
      case AuthAction.TOGGLE_SERVER_ERROR:
        newState.serverError = !newState.serverError

        return newState
      default:
        return state
    }
  } else {
    return state
  }
}
