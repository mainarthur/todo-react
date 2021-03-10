import { RouterAction } from '../constants'

import Route from '../../models/Route'

export interface SetRouteAction {
  type: RouterAction.SET_ROUTE
  payload: Route
}

type RouterActions = SetRouteAction

export default RouterActions
