import AuthBody from '../../api/bodies/AuthBody'
import { AuthAction, AuthTypes } from '../constants'

export interface AuthRequestAction {
  authType: AuthTypes
  type: AuthAction.REQUESTED_AUTH
  payload: AuthBody
}

export interface AuthFailedAction {
  authType: AuthTypes
  type: AuthAction.REQUESTED_AUTH_FAILED
}

export interface AuthSucceededAction {
  authType: AuthTypes
  type: AuthAction.REQUESTED_AUTH_SUCCEEDED
}

export interface AuthClearAction {
  authType: AuthTypes
  type: AuthAction.CLEAR_STATE
}

type AuthActions = AuthClearAction | AuthSucceededAction | AuthFailedAction | AuthRequestAction

export default AuthActions
