import ToDo from '../../models/ToDo';
import User from '../../models/User';
import { AppAction } from '../constants';

export interface SetUserAction {
  type: AppAction.SET_USER;
  payload: User;
}

export interface SetTodosAction {
  type: AppAction.SET_TODOS;
  payload: ToDo[];
}

export interface AddToDoAction {
  type: AppAction.ADD_TODO;
  payload: ToDo;
}

type AppActions = SetTodosAction | AddToDoAction | SetUserAction;

export default AppActions;
