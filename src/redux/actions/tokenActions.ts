import { TokenAction } from '../constants'
import { DeleteTokensAction, SetAccessTokenAction, SetRefreshTokenAction } from '../types/tokenTypes'

export const setRefreshTokenAction = (token: string): SetRefreshTokenAction => ({
  type: TokenAction.SET_REFRESH_TOKEN,
  payload: token,
})

export const setAccessTokenAction = (token: string): SetAccessTokenAction => ({
  type: TokenAction.SET_ACCESS_TOKEN,
  payload: token,
})

export const deleteTokensAction = (): DeleteTokensAction => ({
  type: TokenAction.DELETE_TOKENS,
})
