import * as React from 'react'
import {
  FC,
  useState,
  useCallback,
  ChangeEvent,
  useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'

import DeleteIcon from '@material-ui/icons/Delete'
import CancelIcon from '@material-ui/icons/Cancel'

import DialogTitle from '../../common/DialogTitle'

import DeleteConfirmDialog from '../DeleteConfirmDialog'

import { createAsyncAction } from '../../redux/helpers'
import { RootState } from '../../redux/reducers'
import ComponentProgressBar from '../../common/ComponentProgressBar'
import useStyles from './styles'
import Board from '../../models/Board'
import { requestAddUserToBoardAction, requestDeleteBoard, requestUpdateBoardAction } from '../../redux/actions/boardsActions'
import UserListItem from '../UserListItem'
import InputAdd from '../InputAdd'
import ErrorSnackBar from '../../common/ErrorSnackBar'

interface Props {
  board: Board
  open: boolean,
  onClose: () => void
}

const EditBoardDialog: FC<Props> = ({
  board,
  open,
  onClose: onCloseProp,
}: Props) => {
  const {
    name,
    users,
    id: boardId,
  } = board

  const classes = useStyles()
  const [isLoading, setIsLoading] = useState(false)
  const [textFieldValue, setTextFieldValue] = useState(name)
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)
  const [isLoadError, setIsLoadError] = useState(false)

  const timerId = useRef<ReturnType<typeof setTimeout>>()

  const disabled = isLoading

  const { user } = useSelector((state: RootState) => state.app)
  const dispacth = useDispatch()

  const onAddUser = useCallback(async (email: string) => {
    await createAsyncAction(dispacth, requestAddUserToBoardAction({
      user,
      body: {
        email,
        boardId,
      },
    }))
  }, [dispacth, user, boardId])

  const onSnackBarClose = useCallback(() => {
    setIsLoadError(false)
  }, [setIsLoadError])

  const onDelete = useCallback(async () => {
    setIsDeleteDialogOpened(false)
    try {
      if (!isLoading) {
        setIsLoading(true)
        await createAsyncAction(dispacth, requestDeleteBoard({
          user,
          body: {
            boardId,
          },
        }))
        setIsLoading(false)
      }
    } catch (err) {
      if (!isLoadError) {
        setIsLoadError(true)
      }
    }
  }, [dispacth, user, isLoadError, isLoading, boardId])

  const onDeleteClick = useCallback(() => {
    setIsDeleteDialogOpened(true)
  }, [])

  const onCancel = useCallback(() => {
    setIsDeleteDialogOpened(false)
  }, [])

  const onTextChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTextFieldValue(ev.target.value)
      clearTimeout(timerId.current)
      timerId.current = setTimeout(async () => {
        await createAsyncAction(dispacth, requestUpdateBoardAction({
          user,
          body: {
            name: ev.target.value,
            id: boardId,
          },
        }))
      }, 1000)
    },
    [setTextFieldValue, timerId, dispacth, user, boardId],
  )

  const onClose = useCallback(() => {
    if (!disabled) {
      onCloseProp()
    }
  }, [disabled, onCloseProp])

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={onClose}
      >
        <DialogTitle
          onClose={onClose}
        >
          <TextField
            inputProps={{
              maxLength: 26,
            }}
            value={textFieldValue}
            onChange={onTextChange}
            disabled={disabled}
            className={classes.textField}
          />
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6">
            Users
          </Typography>
          <List>
            {users.map((userId) => <UserListItem key={userId} userId={userId} />)}
          </List>
          <InputAdd
            placeholder="User email"
            onAdd={onAddUser}
            disabled={isLoading}
            loading={isLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={(
              <ComponentProgressBar loading={disabled}>
                <DeleteIcon />
              </ComponentProgressBar>
            )}
            variant="outlined"
            color="secondary"
            disabled={disabled}
            onClick={onDeleteClick}
          >
            Delete
          </Button>
          <Button
            startIcon={(
              <ComponentProgressBar loading={disabled}>
                <CancelIcon />
              </ComponentProgressBar>
            )}
            variant="contained"
            color="primary"
            disabled={disabled}
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <DeleteConfirmDialog open={isDeleteDialogOpened} onCancel={onCancel} onDelete={onDelete} />
      <ErrorSnackBar open={isLoadError} autoHide onClose={onSnackBarClose}>
        Error!
      </ErrorSnackBar>
    </>
  )
}

export default EditBoardDialog
