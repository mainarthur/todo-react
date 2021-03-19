import { createAction } from '../helpers'
import { ToDoAction } from '../constants'

import UpdateToDoBody from '../../api/bodies/UpdateToDoBody'
import DeleteToDoPayload from '../types/payloads/DeleteToDoPayload'
import SetLoadingPartPayload from '../types/payloads/SetLoadingPartPayload'
import BoardPayload from '../types/payloads/BoardPayload'

import ToDo from '../../models/ToDo'
import BodyPayload from '../types/payloads/BodyPayload'
import NewToDoBody from '../../api/bodies/NewToDoBody'
import DeleteManyBody from '../../api/bodies/DeleteManyBody'

export const setTodosAction = createAction<ToDo[] & BoardPayload>(ToDoAction.SET_TODOS)

export const newToDoAction = createAction<BodyPayload<NewToDoBody>>(ToDoAction.REQUEST_NEW_TODO)

export const addToDoAction = createAction<ToDo & BoardPayload>(ToDoAction.ADD_TODO)

export const requestTodosAction = createAction<BoardPayload>(ToDoAction.REQUEST_TODOS)

export const updateToDoAction = createAction<BodyPayload<UpdateToDoBody>>(
  ToDoAction.REQUEST_UPDATE_TODO,
)

export const deleteManyToDosAction = createAction<BodyPayload<DeleteManyBody>>(
  ToDoAction.REQUEST_DELETE_MANY_TODOS,
)

export const deleteToDoAction = createAction<BodyPayload<DeleteToDoPayload & BoardPayload>>(
  ToDoAction.REQUEST_DELETE_TODO,
)

export const setLoadingPartAction = createAction<SetLoadingPartPayload & BoardPayload>(
  ToDoAction.SET_LOADING_PART,
)
