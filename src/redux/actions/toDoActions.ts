import { createAction } from '../helpers'
import { ToDoAction } from '../constants'

import UpdateToDoBody from '../../api/bodies/UpdateToDoBody'
import SetLoadingPartPayload from '../types/payloads/SetLoadingPartPayload'
import BoardPayload from '../types/payloads/BoardPayload'

import ToDo from '../../models/ToDo'
import BodyPayload from '../types/payloads/BodyPayload'
import NewToDoBody from '../../api/bodies/NewToDoBody'
import DeleteManyBody from '../../api/bodies/DeleteManyBody'
import ToDosPayload from '../types/payloads/ToDosPayload'

export const setTodosAction = createAction<ToDosPayload & BoardPayload>(ToDoAction.SET_TODOS)
export const addToDoAction = createAction<ToDo>(ToDoAction.ADD_TODO)
export const updateToDoAction = createAction<ToDo>(ToDoAction.UPDATE_TODO)
export const deleteToDosAction = createAction<DeleteManyBody>(ToDoAction.DELETE_MANY_TODOS)
export const setLoadingPartAction = createAction<SetLoadingPartPayload & BoardPayload>(
  ToDoAction.SET_LOADING_PART,
)

export const requestNewToDoAction = createAction<BodyPayload<NewToDoBody>>(
  ToDoAction.REQUEST_NEW_TODO,
)
export const requestTodosAction = createAction<BoardPayload>(ToDoAction.REQUEST_TODOS)
export const requestUpdateToDoAction = createAction<BodyPayload<UpdateToDoBody>>(
  ToDoAction.REQUEST_UPDATE_TODO,
)
export const requestDeleteToDosAction = createAction<BodyPayload<DeleteManyBody>>(
  ToDoAction.REQUEST_DELETE_MANY_TODOS,
)

export const dbUpdateToDoAction = createAction<BodyPayload<ToDo>>(
  ToDoAction.DB_UPDATE_TODO,
)

export const dbNewToDoAction = createAction<BodyPayload<ToDo>>(
  ToDoAction.DB_NEW_TODO,
)
