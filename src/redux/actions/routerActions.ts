import { RouterAction } from '../constants'
import { SetRouteAction } from '../types/routerTpes'

import Route from '../../models/Route'

export default (route: Route): SetRouteAction => ({
  type: RouterAction.SET_ROUTE,
  payload: route,
})
