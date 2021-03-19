import { createAction } from '../helpers'
import { ToDoAction } from '../constants'

import UpdateToDoBody from '../../api/bodies/UpdateToDoBody'
import DeleteToDoPayload from '../types/payloads/DeleteToDoPayload'
import SetLoadingPartPayload from '../types/payloads/SetLoadingPartPayload'
import BoardPayload from '../types/payloads/BoardPayload'
import NewToDoPayload from '../types/payloads/NewToDoPayload'
import DeleteManyPayload from '../types/payloads/DeleteManyPayload'

import ToDo from '../../models/ToDo'

export const setTodosAction = createAction<ToDo[] & BoardPayload>(ToDoAction.SET_TODOS)

export const newToDoAction = createAction<NewToDoPayload>(ToDoAction.REQUEST_NEW_TODO)

export const addToDoAction = createAction<ToDo & BoardPayload>(ToDoAction.ADD_TODO)

export const requestTodosAction = createAction<BoardPayload>(ToDoAction.REQUEST_TODOS)

export const updateToDoAction = createAction<UpdateToDoBody>(ToDoAction.REQUEST_UPDATE_TODO)

export const deleteManyToDosAction = createAction<DeleteManyPayload>(
  ToDoAction.REQUEST_DELETE_MANY_TODOS,
)

export const deleteToDoAction = createAction<DeleteToDoPayload & BoardPayload>(
  ToDoAction.REQUEST_DELETE_TODO,
)

export const setLoadingPartAction = createAction<SetLoadingPartPayload & BoardPayload>(
  ToDoAction.SET_LOADING_PART,
)
