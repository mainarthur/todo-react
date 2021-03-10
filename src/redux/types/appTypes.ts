import { AppAction } from '../constants'

import User from '../../models/User'

export interface SetUserAction {
  type: AppAction.SET_USER
  payload: User
}

type AppActions = SetUserAction

export default AppActions
