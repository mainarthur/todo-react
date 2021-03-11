import * as React from 'react'
import { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Container from '@material-ui/core/Container'

import { setTodosAction } from '../redux/actions/toDoActions'
import { RootState } from '../redux/reducers'

import { api } from '../api/api'
import DeleteResponse from '../api/responses/DeleteResponse'

import ToDo from '../models/ToDo'
import useStyle from './ToDoListControlsStyles'

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

  const setToDos = (newTodos: ToDo[]) => dispatch(setTodosAction(newTodos))

  const onClearAllClick = async () => {
    const faliedToDeleteIndexes: Array<number> = []

    for (let i = 0; i < todos.length; i += 1) {
      const toDo = todos[i]
      const { _id: toDoId } = toDo
      // eslint-disable-next-line no-await-in-loop
      const response = await api<DeleteResponse, {}>({
        endpoint: `/todo/${toDoId}`,
        method: 'DELETE',
      })

      if (!response.status) {
        faliedToDeleteIndexes.push(i)
      }
    }

    setToDos(todos.filter((e, i) => faliedToDeleteIndexes.indexOf(i) !== -1))

    if (faliedToDeleteIndexes.length > 0) {
      onClearAllError()
    }
  }

  const onClearDoneClick = async () => {
    const faliedToDeleteIndexes: Array<number> = []

    const doneTodos = todos.filter((toDo) => toDo.done)
    const undoneTodos = todos.filter((toDo) => !toDo.done)

    for (let i = 0; i < doneTodos.length; i += 1) {
      const toDo = doneTodos[i]
      const { _id: toDoId } = toDo

      // eslint-disable-next-line no-await-in-loop
      const response = await api<DeleteResponse, {}>({
        endpoint: `/todo/${toDoId}`,
        method: 'DELETE',
      })

      if (!response.status) {
        faliedToDeleteIndexes.push(i)
      }
    }

    const rest = doneTodos.filter((e, i) => faliedToDeleteIndexes.indexOf(i) !== -1)

    const newTodos = [...undoneTodos, ...rest]

    setToDos(newTodos)

    if (faliedToDeleteIndexes.length > 0) {
      onClearDoneError()
    }
  }

  return (
    <Container className={classes.controls}>
      <ButtonGroup>
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
