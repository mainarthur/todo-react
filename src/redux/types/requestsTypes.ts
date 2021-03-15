import { Requester, RequestsAction } from '../constants'

export interface RequestAction {
  requestType: Requester
  type: RequestsAction.REQUESTED
}

export interface FailedAction {
  requestType: Requester
  type: RequestsAction.FAILED
}

export interface SucceededAction {
  requestType: Requester
  type: RequestsAction.SUCCEEDED
}

export interface ClearAction {
  requestType: Requester
  type: RequestsAction.CLEAR
}

type RequestsActions = ClearAction | SucceededAction | FailedAction | RequestAction

export default RequestsActions
