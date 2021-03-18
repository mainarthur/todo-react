import * as React from 'react'
import { FC } from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import useStyles from './styles'

type Props = {
  title: string
}

const BoardHeader: FC<Props> = ({ title }: Props) => {
  const classes = useStyles()
  return (
    <Grid container className={classes.boardHeader}>
      <Typography component="h5" variant="h5">{title}</Typography>
    </Grid>
  )
}

export default BoardHeader
