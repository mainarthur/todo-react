import * as React from 'react'
import { FC, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Container from '@material-ui/core/Container'

import { deleteManyToDosAction, setTodosAction } from '../../../redux/actions/toDoActions'
import { RootState } from '../../../redux/reducers'

import useStyle from './styles'

import { createAsyncAction } from '../../../redux/helpers'

interface Props {
  onClearAllError(): void
  onClearDoneError(): void
}

const ToDoListControls: FC<Props> = ({
  onClearAllError,
  onClearDoneError,
}: Props) => {
  const classes = useStyle()

  const todos = useSelector((state: RootState) => state.todos)
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)

  const onClearAllClick = useCallback(async () => {
    try {
      setIsLoading(true)
      const lastUpdate = await createAsyncAction<number>(dispatch, deleteManyToDosAction({
        todos: todos.map((toDo) => {
          const { _id: toDoId } = toDo
          return toDoId
        }),
      }))
      localStorage.setItem('lastupdate', lastUpdate.toString())
      dispatch(setTodosAction([]))
    } catch (e) {
      onClearAllError()
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, todos, setIsLoading, onClearAllError])

  const onClearDoneClick = useCallback(async () => {
    const doneTodos = todos.filter((toDo) => toDo.done)
    const undoneTodos = todos.filter((toDo) => !toDo.done)

    try {
      setIsLoading(true)
      const lastUpdate = await createAsyncAction<number>(dispatch, deleteManyToDosAction({
        todos: doneTodos.map((toDo) => {
          const { _id: toDoId } = toDo
          return toDoId
        }),
      }))
      localStorage.setItem('lastupdate', lastUpdate.toString())
      dispatch(setTodosAction(undoneTodos))
    } catch (e) {
      onClearDoneError()
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, todos, setIsLoading, onClearDoneError])

  return (
    <Container className={classes.controls}>
      <ButtonGroup disabled={isLoading}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.clearAllButton}
          onClick={onClearAllClick}
        >
          Clear All
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.clearDoneButton}
          onClick={onClearDoneClick}
        >
          Clear Done
        </Button>
      </ButtonGroup>
    </Container>
  )
}

export default ToDoListControls
