import { TokenAction } from '../constants'
import TokenActions from '../types/tokenTypes'

export interface TokensState {
  accessToken: string
  refreshToken: string
}

const initialState: TokensState = {
  accessToken: '',
  refreshToken: '',
}

export default function tokensReducer(state = initialState, action: TokenActions) {
  const newState = { ...state }
  switch (action.type) {
    case TokenAction.SET_ACCESS_TOKEN:
      newState.accessToken = action.payload

      return newState
    case TokenAction.SET_REFRESH_TOKEN:
      newState.refreshToken = action.payload

      return newState
    case TokenAction.DELETE_TOKENS:
      newState.refreshToken = ''
      newState.accessToken = ''

      return newState
    default:
      return newState
  }
}
