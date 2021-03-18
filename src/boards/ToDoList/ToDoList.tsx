import * as React from 'react'
import { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'

import ToDoElement from '../ToDoElement'

import useStyles from './styles'
import ToDo from '../../models/ToDo'

type Props = {
  todos: ToDo[]
}

const ToDoList: FC<Props> = ({ todos }: Props) => {
  const classes = useStyles()

  return (
    <Grid className={classes.boardContent}>
      {todos.map((toDo) => {
        const { _id: toDoId } = toDo
        return (
          <Grid key={toDoId} item xs={12}>
            <ToDoElement toDo={toDo} />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default ToDoList
