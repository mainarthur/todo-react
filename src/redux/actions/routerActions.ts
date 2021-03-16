import { RouterAction } from '../constants'
import Route from '../../models/Route'
import { createAction } from '../helpers'

const setRouteAction = createAction<Route>(RouterAction.SET_ROUTE)

export {
  setRouteAction,
}
