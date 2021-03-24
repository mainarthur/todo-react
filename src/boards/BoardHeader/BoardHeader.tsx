import * as React from 'react'
import { FC, useState, useCallback } from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import EditIcon from '@material-ui/icons/Edit'

import useStyles from './styles'
import Board from '../../models/Board'
import EditBoardDialog from '../EditBoardDialog'

type Props = {
  title: string
  board: Board
}

const BoardHeader: FC<Props> = ({ title, board }: Props) => {
  const classes = useStyles()

  const [isDialogOpened, setIsDialogOpened] = useState(false)

  const onOpenDialog = useCallback(() => {
    setIsDialogOpened(true)
  }, [])

  const onCloseDialog = useCallback(() => {
    setIsDialogOpened(false)
  }, [])

  return (
    <>
      <Grid
        container
        className={classes.boardHeader}
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item zeroMinWidth xs>
          <Typography noWrap component="h5" variant="h5">{title}</Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={onOpenDialog}>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
      <EditBoardDialog open={isDialogOpened} onClose={onCloseDialog} board={board} />
    </>
  )
}

export default BoardHeader
