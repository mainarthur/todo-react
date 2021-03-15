import { AppAction } from '../constants'

import User from '../../models/User'

export interface SetUserAction {
  type: AppAction.SET_USER
  payload: User
}

export interface UserRequestAction {
  type: AppAction.REQUESTED_USER
}

export interface UserFailedAction {
  type: AppAction.REQUESTED_USER_FAILED
}

export interface UserSucceededAction {
  type: AppAction.REQUESTED_USER_SUCCEEDED
}

type AppActions = SetUserAction | UserRequestAction | UserFailedAction | UserSucceededAction

export default AppActions
