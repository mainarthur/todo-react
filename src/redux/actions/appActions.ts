import ToDo from '../../models/ToDo';
import User from '../../models/User';
import { AppAction } from '../constants';
import {
  SetTodosAction,
  SetUserAction,
  AddToDoAction,
} from '../types/appTypes';

export const setTodosAction = (toDos: ToDo[]): SetTodosAction => ({
  type: AppAction.SET_TODOS,
  payload: toDos,
});

export const setUserAction = (user: User): SetUserAction => ({
  type: AppAction.SET_USER,
  payload: user,
});

export const addToDoAction = (toDo: ToDo): AddToDoAction => ({
  type: AppAction.ADD_TODO,
  payload: toDo,
});
