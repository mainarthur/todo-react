import { createAction } from '../helpers'

import { AuthAction } from '../constants'

import AuthBody from '../../api/bodies/AuthBody'

export const loginRequestAction = createAction<AuthBody>(AuthAction.REQUESTED_LOGIN)

export const registerRequestAction = createAction<AuthBody>(AuthAction.REQUESTED_REGISTER)
