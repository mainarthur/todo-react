import { ToDoAction } from '../constants'
import {
  AddToDoAction,
  NewToDoFailedAction,
  NewToDoRequestAction,
  NewToDoSucceededAction,
  SetTodosAction,
} from '../types/todoTypes'

import ToDo from '../../models/ToDo'

export const setTodosAction = (toDos: ToDo[]): SetTodosAction => ({
  type: ToDoAction.SET_TODOS,
  payload: toDos,
})

export const addToDoAction = (toDo: ToDo): AddToDoAction => ({
  type: ToDoAction.ADD_TODO,
  payload: toDo,
})

export const newToDoRequestAction = (text: string): NewToDoRequestAction => ({
  type: ToDoAction.REQUESTED_NEW_TODO,
  payload: {
    text,
  },
})

export const newToDoFailedAction = (): NewToDoFailedAction => ({
  type: ToDoAction.REQUESTED_NEW_TODO_FAILED,
})

export const newToDoSucceededAction = (): NewToDoSucceededAction => ({
  type: ToDoAction.REQUESTED_NEW_TODO_SUCCEEDED,
})
