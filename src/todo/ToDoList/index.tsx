import * as React from 'react'
import {
  useState,
  useEffect,
  FC,
  useMemo,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import { Typography } from '@material-ui/core'
import ErrorSnackBar from '../../common/ErrorSnackBar'
import ReloadButton from '../../common/ReloadButton'
import ToDoElement from '../ToDoElement'

import { api } from '../../api/api'
import UpdateToDoBody from '../../api/bodies/UpdateToDoBody'
import DeleteResponse from '../../api/responses/DeleteResponse'
import ToDoListResponse from '../../api/responses/ToDoListResponse'
import UpdateToDoResponse from '../../api/responses/UpdateToDoResponse'

import { connectDB, defaultStoreName } from '../../indexeddb/connect'

import { setTodosAction } from '../../redux/actions/toDoActions'
import { RootState } from '../../redux/reducers'

import ToDo from '../../models/ToDo'
import User from '../../models/User'

import { err, log } from '../../logging/logger'
import ToDoListControls from './Controls'
import useStyle from './styles'
import ClassNames from '../ClassNames'

import './dnd.scss'

type Props = {
  user: User
}

enum ErrorCodes {
  None = '',
  Delete = 'Failed to delete To-Do',
  PositionChange = 'Failed to change To-Do&apos;s position',
  StatusChange = 'Failed to change To-Do&apos;s status',
  Load = 'To-Do List loading error',
  ClearAll = 'Failed to delete all tasks',
  ClearDone = 'Failed to delete all done tasks',
}

const ToDoList: FC<Props> = ({ user }: Props) => {
  const classes = useStyle()

  const todos = useSelector((state: RootState) => state.todos)
  const dispatch = useDispatch()

  const setToDos = (newToDos: ToDo[]) => dispatch(setTodosAction(newToDos))

  const getToDoById = (id: string): ToDo => todos.find((toDo: ToDo) => {
    const { _id: tId } = toDo

    return tId === id
  })

  const [errorCode, setErrorCode] = useState(ErrorCodes.None)
  const [loadError, setLoadError] = useState(false)

  const onCloseSnackBar = () => {
    if (errorCode !== ErrorCodes.None) {
      setErrorCode(ErrorCodes.None)
    }
  }

  const onClearAllError = () => {
    if (errorCode !== ErrorCodes.ClearAll) {
      setErrorCode(ErrorCodes.ClearAll)
    }
  }

  const onClearDoneError = () => {
    if (errorCode !== ErrorCodes.ClearDone) {
      setErrorCode(ErrorCodes.ClearDone)
    }
  }

  const onToDoPositionChanged = async (id: string, nextId: string, prevId: string) => {
    const prevTodo = getToDoById(prevId)
    const nextTodo = getToDoById(nextId)

    if (prevTodo || nextTodo) {
      let newPosition = 0
      if (!prevTodo) {
        newPosition = nextTodo.position / 2
      } else if (!nextTodo) {
        newPosition = prevTodo.position + 1
      } else {
        newPosition = (prevTodo.position + nextTodo.position) / 2
      }

      const response = await api<UpdateToDoResponse, UpdateToDoBody>({
        endpoint: '/todo',
        method: 'PATCH',
        body: {
          _id: id,
          position: newPosition,
        },
      })

      if (response.status) {
        const newTodos = todos.map((toDo) => {
          const { _id: tId } = toDo
          if (tId === id) {
            const newTodo = { ...toDo }
            newTodo.position = newPosition
            return newTodo
          }

          return toDo
        })

        setToDos(newTodos)
      } else if (errorCode !== ErrorCodes.PositionChange) {
        setErrorCode(ErrorCodes.PositionChange)
      }
    }
  }

  const onToDoStatusChanged = async (toDoId: string, newStatus: boolean) => {
    const response = await api<UpdateToDoResponse, UpdateToDoBody>({
      endpoint: '/todo',
      method: 'PATCH',
      body: {
        _id: toDoId,
        done: newStatus,
      },
    })

    if (response.status) {
      const newTodos = todos.map((t) => {
        const { _id: tId } = t
        if (tId === toDoId) {
          const newTodo = { ...t }
          newTodo.done = newStatus
          return newTodo
        }

        return t
      })

      setToDos(newTodos)
    } else if (errorCode !== ErrorCodes.StatusChange) {
      setErrorCode(ErrorCodes.StatusChange)
    }
  }

  const onToDoDeleted = async (toDoId: string) => {
    const response = await api<DeleteResponse, {}>({
      endpoint: `/todo/${toDoId}`,
      method: 'DELETE',
    })

    if (response.status) {
      const newTodos = todos.filter((t) => {
        const { _id: tId } = t

        return tId !== toDoId
      })

      setToDos(newTodos)
    } else if (errorCode !== ErrorCodes.Delete) {
      setErrorCode(ErrorCodes.Delete)
    }
  }

  const loadTodos = async (newUser: User) => {
    if (newUser) {
      const { _id: userId } = newUser
      const db = await connectDB(`todo-${userId}`)

      try {
        const response = await api<ToDoListResponse, {}>({
          endpoint: `/todo${localStorage.getItem('lastUpdate') ? `?from=${localStorage.getItem('lastUpdate')}` : ''}`,
        })

        log(response)

        if (response.status) {
          const todosResponse = response as ToDoListResponse
          const { results: loadedTodos } = todosResponse
          let maxLastUpdate = 0
          const currentLastUpdate: number = parseInt(localStorage.getItem('lastUpdate'), 10)

          if (!Number.isNaN(currentLastUpdate)) {
            maxLastUpdate = Math.max(currentLastUpdate, maxLastUpdate)
          }

          loadedTodos.forEach((toDo: ToDo) => {
            const { _id: toDoId } = toDo

            if (toDo.lastUpdate) {
              maxLastUpdate = Math.max(maxLastUpdate, toDo.lastUpdate)
            }

            const transaction = db.transaction(defaultStoreName, 'readwrite')
            const store = transaction.objectStore(defaultStoreName)
            if (!toDo.deleted) {
              store.put(toDo)
            } else {
              store.delete(toDoId)
            }
          })

          localStorage.setItem('lastUpdate', `${maxLastUpdate}`)
        } else if (!loadError) {
          setLoadError(true)
        }
      } catch (e) {
        if (!loadError) {
          setLoadError(true)
        }
        err(e)
      } finally {
        const transaction = db.transaction(defaultStoreName, 'readwrite')
        const store = transaction.objectStore(defaultStoreName).index('position')
        const todosRequest = store.getAll()
        todosRequest.addEventListener('success', () => {
          setToDos(todosRequest.result)
        })
      }
    }
  }

  const onReloadTodosClick = async () => {
    if (user) {
      try {
        await loadTodos(user)
      } catch (e) {
        if (!loadError) {
          setLoadError(true)
        }
        err(e)
      }
    }
  }

  useEffect(() => {
    setToDos([])
    if (user) {
      loadTodos(user)
    }
  }, [user, setToDos])

  const todosElements = useMemo(() => todos.map((toDo) => {
    const { _id: tId } = toDo

    return (
      <ToDoElement
        key={tId}
        id={tId}
        text={toDo.text}
        done={toDo.done}
        onDelete={onToDoDeleted}
        onStatusChange={onToDoStatusChanged}
        onPositionChange={onToDoPositionChanged}
      />
    )
  }), [user, todos])

  todosElements.push(<div
    key={ClassNames.BOTTOM_DROPABLE}
    className={ClassNames.BOTTOM_DROPABLE}
  />)

  return (
    <Grid item className={classes.root}>
      <ToDoListControls
        onClearAllError={onClearAllError}
        onClearDoneError={onClearDoneError}
      />
      <Paper className={classes.paper}>
        {todosElements.length > 1 ? <List className={classes.list}>{todosElements}</List> : (
          <Typography variant="body1" className={classes.noToDoText}>
            Tasks you add appear here
          </Typography>
        )}
      </Paper>
      <ErrorSnackBar
        open={loadError}
        action={(
          <ReloadButton onReloadTodosClick={onReloadTodosClick} />
        )}
      >
        {ErrorCodes.Load.toString()}
      </ErrorSnackBar>
      <ErrorSnackBar
        open={errorCode !== ErrorCodes.None}
        key={errorCode}
        autoHide
        onClose={onCloseSnackBar}
      >
        {errorCode.toString()}
      </ErrorSnackBar>
    </Grid>
  )
}

export default ToDoList
