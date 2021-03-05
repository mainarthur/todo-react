import ToDo from '../../models/ToDo';
import { ToDoAction } from '../constants';
import { AddToDoAction, SetTodosAction } from '../types/todoTypes';

export const setTodosAction = (toDos: ToDo[]): SetTodosAction => ({
  type: ToDoAction.SET_TODOS,
  payload: toDos,
});

export const addToDoAction = (toDo: ToDo): AddToDoAction => ({
  type: ToDoAction.ADD_TODO,
  payload: toDo,
});
