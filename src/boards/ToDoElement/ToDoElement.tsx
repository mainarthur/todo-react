import * as React from 'react'
import { FC } from 'react'

import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'

import EditIcon from '@material-ui/icons/Edit'

import useStyles from './styles'
import ToDo from '../../models/ToDo'

type Props = {
  toDo: ToDo
}

const ToDoElement: FC<Props> = ({ toDo }: Props) => {
  const classes = useStyles()

  const {
    text: toDoText,
  } = toDo

  const text = toDoText.length < 60 ? toDoText : `${toDoText.substring(0, 57)}...`

  return (
    <Card
      className={classes.cardRoot}
      variant="outlined"
    >
      <CardHeader
        action={(
          <IconButton>
            <EditIcon />
          </IconButton>
        )}
        title={text}
      />
    </Card>
  )
}

export default ToDoElement
