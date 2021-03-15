import { ToDoAction } from '../constants'

import ToDo from '../../models/ToDo'

import NewToDoBody from '../../api/bodies/NewToDoBody'

export interface SetTodosAction {
  type: ToDoAction.SET_TODOS
  payload: ToDo[]
}

export interface AddToDoAction {
  type: ToDoAction.ADD_TODO
  payload: ToDo
}

export interface NewToDoRequestAction {
  type: ToDoAction.REQUESTED_NEW_TODO
  payload: NewToDoBody
}

export interface NewToDoFailedAction {
  type: ToDoAction.REQUESTED_NEW_TODO_FAILED
}

export interface NewToDoSucceededAction {
  type: ToDoAction.REQUESTED_NEW_TODO_SUCCEEDED
}

type ToDoActions =
  SetTodosAction |
  AddToDoAction |
  NewToDoRequestAction |
  NewToDoFailedAction |
  NewToDoSucceededAction

export default ToDoActions
