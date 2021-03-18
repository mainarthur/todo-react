import { createAction } from '../helpers'
import { ToDoAction } from '../constants'

import NewToDoBody from '../../api/bodies/NewToDoBody'

import ToDo from '../../models/ToDo'
import UpdateToDoBody from '../../api/bodies/UpdateToDoBody'
import DeleteManyBody from '../../api/bodies/DeleteManyBody'
import DeleteToDoPayload from '../types/payloads/DeleteToDoPayload'
import SetLoadingPartPayload from '../types/payloads/SetLoadingPartPayload'
import BoardPayload from '../types/payloads/BoardPayload'

export const setTodosAction = createAction<ToDo[] & BoardPayload>(ToDoAction.SET_TODOS)

export const newToDoAction = createAction<NewToDoBody>(ToDoAction.REQUEST_NEW_TODO)

export const addToDoAction = createAction<ToDo & BoardPayload>(ToDoAction.ADD_TODO)

export const requestTodosAction = createAction<BoardPayload>(ToDoAction.REQUEST_TODOS)

export const updateToDoAction = createAction<UpdateToDoBody>(ToDoAction.REQUEST_UPDATE_TODO)

export const deleteManyToDosAction = createAction<DeleteManyBody>(
  ToDoAction.REQUEST_DELETE_MANY_TODOS,
)

export const deleteToDoAction = createAction<DeleteToDoPayload & BoardPayload>(
  ToDoAction.REQUEST_DELETE_TODO,
)

export const setLoadingPartAction = createAction<SetLoadingPartPayload & BoardPayload>(
  ToDoAction.SET_LOADING_PART,
)
