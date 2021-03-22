import * as React from 'react'
import {
  FC,
  useState,
  useCallback,
} from 'react'

import clsx from 'clsx'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'

import EditIcon from '@material-ui/icons/Edit'

import useStyles from './styles'

import ToDo from '../../models/ToDo'

import EditToDoDialog from '../EditToDoDialog'

type Props = {
  toDo: ToDo
}

const ToDoElement: FC<Props> = ({ toDo }: Props) => {
  const classes = useStyles()

  const [isDialogOpened, setIsDialogOpened] = useState(false)

  const {
    text: toDoText,
    done,
  } = toDo

  const onOpenDialog = useCallback(() => {
    setIsDialogOpened(true)
  }, [])

  const onCloseDialog = useCallback(() => {
    setIsDialogOpened(false)
  }, [])

  const text = toDoText.length < 60 ? toDoText : `${toDoText.substring(0, 57)}...`

  return (
    <>
      <Card
        className={classes.cardRoot}
        variant="outlined"
      >
        <CardHeader
          action={(
            <IconButton onClick={onOpenDialog}>
              <EditIcon />
            </IconButton>
          )}
          className={clsx(done && classes.doneToDo)}
          title={text}
        />
      </Card>
      <EditToDoDialog open={isDialogOpened} onClose={onCloseDialog} toDo={toDo} />
    </>
  )
}

export default ToDoElement
