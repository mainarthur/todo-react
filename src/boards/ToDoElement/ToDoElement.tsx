import * as React from 'react'
import {
  FC,
  useState,
  useCallback,
  ChangeEvent,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import clsx from 'clsx'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import EditIcon from '@material-ui/icons/Edit'

import DialogTitle from '../../common/DialogTitle'

import useStyles from './styles'

import ToDo from '../../models/ToDo'

import { createAsyncAction } from '../../redux/helpers'
import { requestUpdateToDoAction } from '../../redux/actions/toDoActions'
import { RootState } from '../../redux/reducers'

type Props = {
  toDo: ToDo
}

const ToDoElement: FC<Props> = ({ toDo }: Props) => {
  const classes = useStyles()

  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadError, setIsLoadError] = useState(false)

  const { user } = useSelector((state: RootState) => state.app)
  const dispacth = useDispatch()

  const {
    text: toDoText,
    done,
    id,
    boardId,
  } = toDo

  const onOpenDialog = useCallback(() => {
    setIsDialogOpened(true)
  }, [])

  const onCloseDialog = useCallback(() => {
    if (!isLoading) {
      setIsDialogOpened(false)
    }
  }, [isLoading])

  const onStatusChange = useCallback(
    async (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      try {
        await createAsyncAction(dispacth, requestUpdateToDoAction({
          user,
          body: {
            id,
            boardId,
            done: checked,
          },
        }))
      } catch (err) {
        if (!isLoadError) {
          setIsLoadError(true)
        }
      }
    },
    [isLoadError, dispacth, id, user, boardId],
  )

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
      <Dialog
        fullWidth
        maxWidth="md"
        open={isDialogOpened}
        onClose={onCloseDialog}
      >
        <DialogTitle
          onClose={onCloseDialog}
        >
          <FormControlLabel
            label={text}
            control={(
              <Checkbox
                checked={done}
                onChange={onStatusChange}
              />
            )}
          />
        </DialogTitle>
      </Dialog>
    </>
  )
}

export default ToDoElement
