import { createAction } from '../helpers'
import { AppAction } from '../constants'
import User from '../../models/User'

const setUserAction = createAction<User>(AppAction.SET_USER)

export {
  setUserAction,
}
