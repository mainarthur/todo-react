/* eslint-disable @typescript-eslint/indent */
import { Actions, AuthMethod } from '../constants';

export interface ChangeEmailAction {
  method: AuthMethod;
  type: Actions.CHANGE_EMAIL;
  payload: string;
}

export interface ChangeNameAction {
  method: AuthMethod;
  type: Actions.CHANGE_NAME;
  payload: string;
}

export interface ChangePasswordAction {
  method: AuthMethod;
  type: Actions.CHANGE_PASSWORD;
  payload: string;
}

export interface ToggleEmailValidationAction {
  method: AuthMethod;
  type: Actions.TOGGLE_EMAIL_VALIDATION;
}

export interface ToggleNameValidationAction {
  method: AuthMethod;
  type: Actions.TOGGLE_NAME_VALIDATION;
}

export interface TogglePasswordValidationAction {
  method: AuthMethod;
  type: Actions.TOGGLE_PASSWORD_VALIDATION;
}

export interface ToggleServerErrorAction {
  method: AuthMethod;
  type: Actions.TOGGLE_SERVER_ERROR;
}

type AuthActions = ChangeEmailAction |
  ChangeNameAction |
  ChangePasswordAction |
  ToggleEmailValidationAction |
  ToggleNameValidationAction |
  TogglePasswordValidationAction |
  ToggleServerErrorAction;

export default AuthActions;
