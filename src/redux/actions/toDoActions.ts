import { createAction } from '../helpers'
import { ToDoAction } from '../constants'

import NewToDoBody from '../../api/bodies/NewToDoBody'

import ToDo from '../../models/ToDo'
import UpdateToDoBody from '../../api/bodies/UpdateToDoBody'
import DeleteManyBody from '../../api/bodies/DeleteManyBody'
import DeleteToDoPayload from '../types/payloads/DeleteToDoPayload'
import SetLoadingPartPayload from '../types/payloads/SetLoadingPartPayload'

export const setTodosAction = createAction<ToDo[]>(ToDoAction.SET_TODOS)

export const newToDoAction = createAction<NewToDoBody>(ToDoAction.REQUEST_NEW_TODO)

export const addToDoAction = createAction<ToDo>(ToDoAction.ADD_TODO)

export const requestTodosAction = createAction(ToDoAction.REQUEST_TODOS)

export const updateToDoAction = createAction<UpdateToDoBody>(ToDoAction.REQUEST_UPDATE_TODO)

export const deleteManyToDosAction = createAction<DeleteManyBody>(
  ToDoAction.REQUEST_DELETE_MANY_TODOS,
)

export const deleteToDoAction = createAction<DeleteToDoPayload>(
  ToDoAction.REQUEST_DELETE_TODO,
)

export const setLoadingPartAction = createAction<SetLoadingPartPayload>(ToDoAction.SET_LOADING_PART)
