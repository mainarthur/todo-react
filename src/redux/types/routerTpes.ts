import Route from '../../models/Route'
import { RouterAction } from '../constants'

export interface SetRouteAction {
  type: RouterAction.SET_ROUTE
  payload: Route
}

type RouterActions = SetRouteAction

export default RouterActions
