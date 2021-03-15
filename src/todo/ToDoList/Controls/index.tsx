import * as React from 'react'
import { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Container from '@material-ui/core/Container'

import { setTodosAction } from '../../../redux/actions/toDoActions'
import { RootState } from '../../../redux/reducers'

import { api } from '../../../api/api'
import DeleteResponse from '../../../api/responses/DeleteResponse'

import ToDo from '../../../models/ToDo'
import useStyle from './styles'
import DeleteManyResponse from '../../../api/responses/DeleteManyResponse'
import DeleteManyBody from '../../../api/bodies/DeleteManyBody'

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
    const response = await api<DeleteManyResponse, DeleteManyBody>({
      endpoint: '/todo/',
      method: 'DELETE',
      body: {
        todos: todos.map((toDo) => {
          const { _id: toDoId } = toDo
          return toDoId
        }),
      },
    })
    if (response.status) {
      localStorage.setItem('lastupdate', (response as DeleteManyResponse).lastUpdate.toString())
      setToDos([])
    } else {
      onClearAllError()
    }
  }

  const onClearDoneClick = async () => {
    const doneTodos = todos.filter((toDo) => toDo.done)
    const undoneTodos = todos.filter((toDo) => !toDo.done)

    const response = await api<DeleteManyResponse, DeleteManyBody>({
      endpoint: '/todo/',
      method: 'DELETE',
      body: {
        todos: doneTodos.map((toDo) => {
          const { _id: toDoId } = toDo
          return toDoId
        }),
      },
    })
    if (response.status) {
      localStorage.setItem('lastupdate', (response as DeleteManyResponse).lastUpdate.toString())
      setToDos(undoneTodos)
    } else {
      onClearAllError()
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
