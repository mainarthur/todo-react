import { TokenAction } from '../constants'

export interface SetRefreshTokenAction {
  type: TokenAction.SET_REFRESH_TOKEN
  payload: string
}

export interface SetAccessTokenAction {
  type: TokenAction.SET_ACCESS_TOKEN
  payload: string
}

export interface DeleteTokensAction {
  type: TokenAction.DELETE_TOKENS
}

type TokenActions = SetRefreshTokenAction | SetAccessTokenAction | DeleteTokensAction

export default TokenActions
