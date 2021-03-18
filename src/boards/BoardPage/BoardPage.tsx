import * as React from 'react'
import { FC } from 'react'
import { useSelector } from 'react-redux'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import useStyles from './styles'

const BoardPage: FC = () => {
  const classes = useStyles()
  const boards = useSelector()

  return (
    <Grid container className={classes.root} spacing={3}>
      <Grid container className={classes.boardsWrap}>
        <Grid className={classes.boardsContent}>
          {boards && boards.map((board) => {
            const { _id: boardId, name } = board

            return (
              <Paper key={boardId} elevation={3} className={classes.boardCard}>
                <BoardHeader title={name} boardId={boardId} />
                <Divider />
                <ToDoList boardId={boardId} />
                <Divider className={classes.divider} />
                <BoardFooter boardId={boardId} />
              </Paper>
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default BoardPage
