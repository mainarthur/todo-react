import Route from '../../models/Route'
import { RouterAction } from '../constants'
import RouterActions from '../types/routerTpes'

export type RouterState = {
  route: Route
}

const initialState: RouterState = {
  route: null,
}

export default function routerReducer(state = initialState, action: RouterActions): RouterState {
  const newState = { ...state }
  switch (action.type) {
    case RouterAction.SET_ROUTE:
      newState.route = { ...action.payload }

      return newState
    default:
      return state
  }
}
