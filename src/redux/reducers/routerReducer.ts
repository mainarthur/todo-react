import Route from '../../models/Route'
import { setRouteAction } from '../actions/routerActions'
import Action from '../types/Action'

export type RouterState = {
  route: Route
}

const initialState: RouterState = {
  route: null,
}

export default function routerReducer(state = initialState, action: Action): RouterState {
  const newState = { ...state }

  if (setRouteAction.match(action)) {
    newState.route = { ...action.payload }
  }

  return newState
}
