import * as React from 'react'
import {
  FC,
  useState,
  useCallback,
  ChangeEvent,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Dialog from '@material-ui/core/Dialog'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'

import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'

import DialogTitle from '../../common/DialogTitle'

import DeleteConfirmDialog from '../DeleteConfirmDialog'
import ToDo from '../../models/ToDo'

import { createAsyncAction } from '../../redux/helpers'
import { requestDeleteToDosAction, requestUpdateToDoAction } from '../../redux/actions/toDoActions'
import { RootState } from '../../redux/reducers'
import { LoadingPart } from '../../common/constants'
import ComponentProgressBar from '../../common/ComponentProgressBar'
import useStyles from './styles'
import Board from '../../models/Board'

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
  } = board
  const disabled = false

  const classes = useStyles()
  const [textFieldValue, setTextFieldValue] = useState(name)
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)
  const [isLoadError, setIsLoadError] = useState(false)

  const { user } = useSelector((state: RootState) => state.app)
  const dispacth = useDispatch()

  const onDelete = useCallback(async () => {
    setIsDeleteDialogOpened(false)
    try {

    } catch (err) {
      if (!isLoadError) {
        setIsLoadError(true)
      }
    }
  }, [dispacth, id, user, isLoadError])

  const onDeleteClick = useCallback(() => {
    setIsDeleteDialogOpened(true)
  }, [])

  const onCancel = useCallback(() => {
    setIsDeleteDialogOpened(false)
  }, [])

  const onTextChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTextFieldValue(ev.target.value)
    },
    [setTextFieldValue],
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
            multiline
            value={textFieldValue}
            onChange={onTextChange}
            disabled={disabled}
            className={classes.textField}
          />
        </DialogTitle>
        <DialogContent dividers>

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
                <SaveIcon />
              </ComponentProgressBar>
            )}
            variant="contained"
            color="primary"
            disabled={disabled}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <DeleteConfirmDialog open={isDeleteDialogOpened} onCancel={onCancel} onDelete={onDelete} />
    </>
  )
}
