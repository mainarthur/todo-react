import {
  deleteTokensAction,
  setAccessTokenAction,
  setRefreshTokenAction,
} from '../actions/tokenActions'
import Action from '../types/Action'

export interface TokensState {
  accessToken: string
  refreshToken: string
}

const initialState: TokensState = {
  accessToken: '',
  refreshToken: '',
}

export default function tokensReducer(state = initialState, action: Action) {
  const newState = { ...state }

  if (setAccessTokenAction.match(action)) {
    newState.accessToken = action.payload
  }

  if (setRefreshTokenAction.match(action)) {
    newState.refreshToken = action.payload
  }

  if (deleteTokensAction.match(action)) {
    newState.refreshToken = ''
    newState.accessToken = ''
  }

  return newState
}
