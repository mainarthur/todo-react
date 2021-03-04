import { AuthAction, AuthMethod } from '../constants';
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
  type: AuthAction.CHANGE_EMAIL,
  payload: newEmail,
});

export const changePasswordAction = (
  newPassword: string,
  method: AuthMethod,
): ChangePasswordAction => ({
  method,
  type: AuthAction.CHANGE_PASSWORD,
  payload: newPassword,
});

export const changeNameAction = (newName: string, method: AuthMethod): ChangeNameAction => ({
  method,
  type: AuthAction.CHANGE_NAME,
  payload: newName,
});

export const toggleEmailValidationAction = (method: AuthMethod): ToggleEmailValidationAction => ({
  method,
  type: AuthAction.TOGGLE_EMAIL_VALIDATION,
});

export const togglePasswordValidationAction = (
  method: AuthMethod,
): TogglePasswordValidationAction => ({
  method,
  type: AuthAction.TOGGLE_PASSWORD_VALIDATION,
});

export const toggleNameValidationAction = (method: AuthMethod): ToggleNameValidationAction => ({
  method,
  type: AuthAction.TOGGLE_NAME_VALIDATION,
});

export const toggleServerErrorAction = (method: AuthMethod): ToggleServerErrorAction => ({
  method,
  type: AuthAction.TOGGLE_SERVER_ERROR,
});
