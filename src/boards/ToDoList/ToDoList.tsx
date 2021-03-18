import * as React from 'react'
import { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'

import useStyles from './styles'

type Props = {
  boardId: string
}

const ToDoList: FC<Props> = ({ boardId }: Props) => {
  const classes = useStyles()
  const todos = useSelector()

  useEffect(() => {

  }, [boardId])
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
