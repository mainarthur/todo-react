import ToDo from '../../models/ToDo'
import { ToDoAction } from '../constants'

export interface SetTodosAction {
  type: ToDoAction.SET_TODOS
  payload: ToDo[]
}

export interface AddToDoAction {
  type: ToDoAction.ADD_TODO
  payload: ToDo
}

type ToDoActions = SetTodosAction | AddToDoAction

export default ToDoActions
