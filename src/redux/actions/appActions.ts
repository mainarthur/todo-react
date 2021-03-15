import { AppAction } from '../constants'
import {
  SetUserAction,
  UserFailedAction,
  UserRequestAction,
  UserSucceededAction,
} from '../types/appTypes'

import User from '../../models/User'

export const setUserAction = (user: User): SetUserAction => ({
  type: AppAction.SET_USER,
  payload: user,
})

export const userRequestAction = (): UserRequestAction => ({
  type: AppAction.REQUESTED_USER,
})

export const userFailedAction = (): UserFailedAction => ({
  type: AppAction.REQUESTED_USER_FAILED,
})

export const userSucceededAction = (): UserSucceededAction => ({
  type: AppAction.REQUESTED_USER_SUCCEEDED,
})
