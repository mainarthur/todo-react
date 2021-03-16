import * as React from 'react'
import {
  useState,
  useEffect,
  FC,
  useCallback,
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
import UpdateToDoResponse from '../../api/responses/UpdateToDoResponse'

import { connectDB, defaultStoreName } from '../../indexeddb/connect'

import { requestTodosAction, setTodosAction } from '../../redux/actions/toDoActions'
import { RootState } from '../../redux/reducers'

import ToDo from '../../models/ToDo'
import User from '../../models/User'

import ToDoListControls from './Controls'
import useStyle from './styles'
import { createAsyncAction } from '../../redux/helpers'

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

  const getToDoById = useCallback((id: string): ToDo => todos.find((toDo: ToDo) => {
    const { _id: tId } = toDo

    return tId === id
  }), [todos])

  const [errorCode, setErrorCode] = useState(ErrorCodes.None)
  const [isLoading, setIsLoading] = useState(false)
  const [isToDosLoaded, setIsToDosLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)

  const onCloseSnackBar = useCallback(() => {
    if (errorCode !== ErrorCodes.None) {
      setErrorCode(ErrorCodes.None)
    }
  }, [errorCode])

  const onClearAllError = useCallback(() => {
    if (errorCode !== ErrorCodes.ClearAll) {
      setErrorCode(ErrorCodes.ClearAll)
    }
  }, [errorCode])

  const onClearDoneError = useCallback(() => {
    if (errorCode !== ErrorCodes.ClearDone) {
      setErrorCode(ErrorCodes.ClearDone)
    }
  }, [errorCode])

  const onToDoPositionChanged = useCallback(async (id: string, nextId: string, prevId: string) => {
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

        dispatch(setTodosAction(newTodos))
      } else if (errorCode !== ErrorCodes.PositionChange) {
        setErrorCode(ErrorCodes.PositionChange)
      }
    }
  }, [errorCode, getToDoById, dispatch, todos])

  const onToDoStatusChanged = useCallback(async (toDoId: string, newStatus: boolean) => {
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

      dispatch(setTodosAction(newTodos))
    } else if (errorCode !== ErrorCodes.StatusChange) {
      setErrorCode(ErrorCodes.StatusChange)
    }
  }, [errorCode, dispatch, todos])

  const onToDoDeleted = useCallback(async (toDoId: string) => {
    const response = await api<DeleteResponse, {}>({
      endpoint: `/todo/${toDoId}`,
      method: 'DELETE',
    })

    if (response.status) {
      const newTodos = todos.filter((t) => {
        const { _id: tId } = t

        return tId !== toDoId
      })

      dispatch(setTodosAction(newTodos))
    } else if (errorCode !== ErrorCodes.Delete) {
      setErrorCode(ErrorCodes.Delete)
    }
  }, [errorCode, dispatch, todos])

  const loadTodos = useCallback(async (newUser: User) => {
    if (newUser && !isLoading && !isToDosLoaded) {
      setIsLoading(true)
      const { _id: userId } = newUser
      const db = await connectDB(`todo-${userId}`)
      try {
        const loadedTodos = await createAsyncAction<ToDo[]>(dispatch, requestTodosAction())

        loadedTodos.forEach((toDo: ToDo) => {
          const { _id: toDoId } = toDo

          const transaction = db.transaction(defaultStoreName, 'readwrite')
          const store = transaction.objectStore(defaultStoreName)
          if (!toDo.deleted) {
            store.put(toDo)
          } else {
            store.delete(toDoId)
          }
        })

        setIsToDosLoaded(true)

        if (loadError) {
          setLoadError(false)
        }
      } catch (e) {
        if (!loadError) {
          setLoadError(true)
        }
      } finally {
        const transaction = db.transaction(defaultStoreName, 'readwrite')
        const store = transaction.objectStore(defaultStoreName).index('position')
        const todosRequest = store.getAll()
        todosRequest.addEventListener('success', () => {
          dispatch(setTodosAction(todosRequest.result))
        })
        setIsLoading(false)
      }
    }
  }, [loadError, isLoading, isToDosLoaded, setIsToDosLoaded, setIsLoading, setLoadError, dispatch])

  const onReloadTodosClick = useCallback(async () => {
    if (user) {
      try {
        await loadTodos(user)
      } catch (e) {
        if (!loadError) {
          setLoadError(true)
        }
      }
    }
  }, [user, loadError, loadTodos])

  useEffect(() => {
    dispatch(setTodosAction([]))
    if (user) {
      loadTodos(user)
    }
  }, [user, dispatch, loadTodos])

  return (
    <Grid item className={classes.root}>
      <ToDoListControls
        onClearAllError={onClearAllError}
        onClearDoneError={onClearDoneError}
      />
      <Paper className={classes.paper}>
        {(!isLoading || loadError) && (
          <>
            {todos.length > 0 ? (
              <List className={classes.list}>
                {todos.map((toDo) => {
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
                      bottomDndClassName={classes.bottomDnd}
                    />
                  )
                })}
                <div className={classes.bottomDnd} />
              </List>
            ) : (
              <Typography variant="body1" className={classes.noToDoText}>
                Tasks you add appear here
              </Typography>
            )}
          </>
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
