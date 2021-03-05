import User from '../../models/User'
import { AppAction } from '../constants'
import {
  SetUserAction,
} from '../types/appTypes'

export default (user: User): SetUserAction => ({
  type: AppAction.SET_USER,
  payload: user,
})
