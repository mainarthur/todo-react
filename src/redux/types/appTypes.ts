import User from '../../models/User';
import { AppAction } from '../constants';

export interface SetUserAction {
  type: AppAction.SET_USER;
  payload: User;
}

type AppActions = SetUserAction;

export default AppActions;
