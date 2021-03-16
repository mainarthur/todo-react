import { createAction } from '../helpers'
import { AppAction } from '../constants'
import User from '../../models/User'

export const setUserAction = createAction<User>(AppAction.SET_USER)

export const requestUserAction = createAction(AppAction.REQUEST_USER)
