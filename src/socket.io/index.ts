import { Dispatch } from 'redux'
import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'
import DeleteManyBody from '../api/bodies/DeleteManyBody'
import ToDo from '../models/ToDo'
import {
  addToDoAction,
  deleteToDosAction,
  updateToDoAction,
} from '../redux/actions/toDoActions'

export const ENDPOINT = 'http://api.todolist.local'

let socket: Socket<DefaultEventsMap, DefaultEventsMap>

export const initSocket = (
  newSocket: Socket<DefaultEventsMap, DefaultEventsMap>,
  dispatch: Dispatch<any>,
) => {
  socket = newSocket

  socket.on('update-todo', (toDo: ToDo) => {
    dispatch(updateToDoAction(toDo))
  })

  socket.on('new-todo', (toDo: ToDo) => {
    dispatch(addToDoAction(toDo))
  })

  socket.on('delete-todos', (body: DeleteManyBody) => {
    dispatch(deleteToDosAction(body))
  })
}

export const getSocket = () => socket
