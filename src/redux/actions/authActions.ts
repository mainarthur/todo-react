import AuthBody from '../../api/bodies/AuthBody'
import { AuthAction, AuthTypes } from '../constants'
import {
  AuthFailedAction,
  AuthRequestAction,
  AuthSucceededAction,
  AuthClearAction,
} from '../types/authActions'

export const authRequestAction = (payload: AuthBody, authType: AuthTypes): AuthRequestAction => ({
  payload,
  authType,
  type: AuthAction.REQUESTED_AUTH,
})

export const authFailedAction = (authType: AuthTypes): AuthFailedAction => ({
  authType,
  type: AuthAction.REQUESTED_AUTH_FAILED,
})

export const authSucceededAction = (authType: AuthTypes): AuthSucceededAction => ({
  authType,
  type: AuthAction.REQUESTED_AUTH_SUCCEEDED,
})

export const authClearAction = (authType: AuthTypes): AuthClearAction => ({
  authType,
  type: AuthAction.CLEAR_STATE,
})
