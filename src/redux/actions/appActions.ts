import { createAction } from '../helpers'
import { AppAction } from '../constants'
import User from '../../models/User'
import UserPayload from '../types/payloads/UserPayload'

export const setUserAction = createAction<User>(AppAction.SET_USER)

export const requestUserAction = createAction<UserPayload>(AppAction.REQUEST_USER)
