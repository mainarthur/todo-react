import { AppAction } from '../constants'
import { SetUserAction } from '../types/appTypes'

import User from '../../models/User'

export default (user: User): SetUserAction => ({
  type: AppAction.SET_USER,
  payload: user,
})
