import { TokenAction } from '../constants'
import { createAction } from '../helpers'

export const setRefreshTokenAction = createAction<string>(TokenAction.SET_REFRESH_TOKEN)

export const setAccessTokenAction = createAction<string>(TokenAction.SET_ACCESS_TOKEN)

export const deleteTokensAction = createAction(TokenAction.DELETE_TOKENS)
