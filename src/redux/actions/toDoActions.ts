import { ToDoAction } from '../constants'
import ToDo from '../../models/ToDo'
import { createAction } from '../helpers'
import NewToDoBody from '../../api/bodies/NewToDoBody'

export const setTodosAction = createAction<ToDo[]>(ToDoAction.SET_TODOS)

export const newToDoAction = createAction<NewToDoBody>(ToDoAction.REQUEST_NEW_TODO)

export const addToDoAction = createAction<ToDo>(ToDoAction.ADD_TODO)
