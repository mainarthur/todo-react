import Route from '../../models/Route';
import { RouterAction } from '../constants';
import {
  SetRouteAction,
} from '../types/routerTpes';

export default (route: Route): SetRouteAction => ({
  type: RouterAction.SET_ROUTE,
  payload: route,
});
