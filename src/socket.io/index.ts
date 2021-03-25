import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'
import DeleteManyBody from '../api/bodies/DeleteManyBody'
import Board from '../models/Board'
import ToDo from '../models/ToDo'
import { deleteStoredBoardAction, storeNewBoardAction, storeUpdatedBoardAction } from '../redux/actions/boardsActions'
import {
  deleteStoredToDosAction,
  storeNewToDoAction,
  storeToDoUpdateAction,
} from '../redux/actions/toDoActions'
import store from '../redux/store'

export const ENDPOINT = 'http://api.todolist.local'

let socket: Socket<DefaultEventsMap, DefaultEventsMap>

export const initSocket = (
  newSocket: Socket<DefaultEventsMap, DefaultEventsMap>,
) => {
  socket = newSocket

  socket.on('update-todo', (toDo: ToDo) => {
    const {
      app: {
        user,
      },
    } = store.getState()
    store.dispatch(storeToDoUpdateAction({
      user,
      body: toDo,
    }))
  })

  socket.on('new-todo', (toDo: ToDo) => {
    const {
      app: {
        user,
      },
    } = store.getState()
    store.dispatch(storeNewToDoAction({
      user,
      body: toDo,
    }))
  })
  socket.on('update-board', (board: Board) => {
    const {
      app: {
        user,
      },
    } = store.getState()
    store.dispatch(storeUpdatedBoardAction({
      user,
      body: board,
    }))
  })

  socket.on('new-board', (board: Board) => {
    const {
      app: {
        user,
      },
      boards,
    } = store.getState()
    if (!boards.find((b) => b.id === board.id)) {
      socket.emit('join-board', board.id)
      store.dispatch(storeNewBoardAction({
        user,
        body: board,
      }))
    }
  })

  socket.on('delete-board', (board: Board) => {
    const {
      app: {
        user,
      },
    } = store.getState()
    store.dispatch(deleteStoredBoardAction({
      user,
      body: board,
    }))
  })

  socket.on('delete-todos', (body: DeleteManyBody) => {
    const {
      app: {
        user,
      },
    } = store.getState()
    store.dispatch(deleteStoredToDosAction({
      user,
      body,
    }))
  })
}

export const getSocket = () => socket
