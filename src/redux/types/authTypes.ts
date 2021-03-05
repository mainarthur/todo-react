/* eslint-disable @typescript-eslint/indent */
import { AuthAction, AuthMethod } from '../constants'

export interface ChangeEmailAction {
  method: AuthMethod
  type: AuthAction.CHANGE_EMAIL
  payload: string
}

export interface ChangeNameAction {
  method: AuthMethod
  type: AuthAction.CHANGE_NAME
  payload: string
}

export interface ChangePasswordAction {
  method: AuthMethod
  type: AuthAction.CHANGE_PASSWORD
  payload: string
}

export interface ToggleEmailValidationAction {
  method: AuthMethod
  type: AuthAction.TOGGLE_EMAIL_VALIDATION
}

export interface ToggleNameValidationAction {
  method: AuthMethod
  type: AuthAction.TOGGLE_NAME_VALIDATION
}

export interface TogglePasswordValidationAction {
  method: AuthMethod
  type: AuthAction.TOGGLE_PASSWORD_VALIDATION
}

export interface ToggleServerErrorAction {
  method: AuthMethod
  type: AuthAction.TOGGLE_SERVER_ERROR
}

type AuthActions = ChangeEmailAction |
  ChangeNameAction |
  ChangePasswordAction |
  ToggleEmailValidationAction |
  ToggleNameValidationAction |
  TogglePasswordValidationAction |
  ToggleServerErrorAction

export default AuthActions
