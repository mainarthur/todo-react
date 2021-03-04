import { Actions, AuthMethod } from '../constants';
import {
  ChangeEmailAction,
  ChangeNameAction,
  ChangePasswordAction,
  ToggleEmailValidationAction,
  ToggleNameValidationAction,
  TogglePasswordValidationAction,
  ToggleServerErrorAction,
} from '../types/authTypes';

export const changeEmailAction = (newEmail: string, method: AuthMethod): ChangeEmailAction => ({
  method,
  type: Actions.CHANGE_EMAIL,
  payload: newEmail,
});

export const changePasswordAction = (
  newPassword: string,
  method: AuthMethod,
): ChangePasswordAction => ({
  method,
  type: Actions.CHANGE_PASSWORD,
  payload: newPassword,
});

export const changeNameAction = (newName: string, method: AuthMethod): ChangeNameAction => ({
  method,
  type: Actions.CHANGE_NAME,
  payload: newName,
});

export const toggleEmailValidationAction = (method: AuthMethod): ToggleEmailValidationAction => ({
  method,
  type: Actions.TOGGLE_EMAIL_VALIDATION,
});

export const togglePasswordValidationAction = (
  method: AuthMethod,
): TogglePasswordValidationAction => ({
  method,
  type: Actions.TOGGLE_PASSWORD_VALIDATION,
});

export const toggleNameValidationAction = (method: AuthMethod): ToggleNameValidationAction => ({
  method,
  type: Actions.TOGGLE_NAME_VALIDATION,
});

export const toggleServerErrorAction = (method: AuthMethod): ToggleServerErrorAction => ({
  method,
  type: Actions.TOGGLE_SERVER_ERROR,
});
