import { Requester, RequestsAction } from '../constants'
import RequestsActions from '../types/requestsTypes'

type RequestState = {
  ok: boolean,
  loading: boolean,
  error: boolean,
}

export type RequestsState = {
  [key in Requester]?: RequestState
}

const initialState: RequestsState = {}

const getInitialValues = (): RequestState => ({
  ok: false,
  loading: false,
  error: false,
})

export default function requestsReducer(state = initialState, action: RequestsActions) {
  const { requestType } = action

  const newState = { ...state }

  if (newState[requestType]) {
    newState[requestType] = getInitialValues()
  }

  switch (action.type) {
    case RequestsAction.CLEAR:
      newState[requestType] = getInitialValues()
      return newState
    case RequestsAction.REQUESTED:
      newState[requestType].ok = false
      newState[requestType].error = false
      newState[requestType].loading = true

      return newState
    case RequestsAction.FAILED:
      newState[requestType].ok = false
      newState[requestType].error = true
      newState[requestType].loading = false

      return newState
    case RequestsAction.SUCCEEDED:
      newState[requestType].ok = true
      newState[requestType].error = false
      newState[requestType].loading = false

      return newState
    default:
      return state
  }
}
