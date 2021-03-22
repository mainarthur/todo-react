import * as React from 'react'
import {
  FC,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'

import ToDoElement from '../ToDoElement'

import useStyles from './styles'
import ToDo from '../../models/ToDo'
import { RootState } from '../../redux/reducers'
import { createAsyncAction } from '../../redux/helpers'
import { requestTodosAction, setTodosAction } from '../../redux/actions/toDoActions'

type Props = {
  boardId: string
}

const ToDoList: FC<Props> = ({ boardId }: Props) => {
  const classes = useStyles()

  const [isLoading, setIsLoading] = useState(false)
  const [isToDosLoaded, setIsToDosLoaded] = useState(false)
  const [isLoadError, setIsLoadError] = useState(false)

  const { todos } = useSelector(
    (state: RootState) => state.boards.find((board) => board.id === boardId),
  )
  const { user } = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch()

  const loadToDos = useCallback(async () => {
    try {
      const loadedTodos = await createAsyncAction<ToDo[]>(dispatch, requestTodosAction({
        boardId,
        user,
      }))

      dispatch(setTodosAction({
        boardId,
        todos: loadedTodos,
      }))
      setIsToDosLoaded(true)

      if (isLoadError) {
        setIsLoadError(false)
      }
    } catch (err) {
      if (!isLoadError) {
        setIsLoadError(true)
      }
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, boardId, user, isLoadError])

  useEffect(() => {
    if (user && !isLoading && !isToDosLoaded) {
      setIsLoading(true)
      loadToDos()
    }
  }, [user, isLoading, isToDosLoaded, loadToDos])

  return (
    <Grid className={classes.boardContent}>
      {todos.map((toDo) => (
        <Grid key={toDo.id} item xs={12}>
          <ToDoElement toDo={toDo} />
        </Grid>
      ))}
    </Grid>
  )
}

export default ToDoList
