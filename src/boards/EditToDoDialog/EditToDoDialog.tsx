import * as React from 'react'
import {
  FC,
  useState,
  useCallback,
  ChangeEvent,
} from 'react'
import { useDispatch } from 'react-redux'

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
import { LoadingPart } from '../../common/constants'
import ComponentProgressBar from '../../common/ComponentProgressBar'
import useStyles from './styles'
import useUser from '../../hooks/useUser'

interface Props {
  toDo: ToDo
  open: boolean
  onClose: () => void
}

const EditToDoDialog: FC<Props> = ({
  toDo,
  open,
  onClose: onCloseProp,
}: Props) => {
  const {
    done,
    text: toDoText,
    id,
    boardId,
    loadingPart,
  } = toDo

  const disabled = loadingPart !== LoadingPart.NONE

  const classes = useStyles()

  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)
  const [textFieldValue, setTextFieldValue] = useState(toDoText)
  const [isLoadError, setIsLoadError] = useState(false)

  const user = useUser()
  const dispacth = useDispatch()

  const onSaveClick = useCallback(
    async () => {
      if (textFieldValue.trim() !== toDoText) {
        try {
          await createAsyncAction(dispacth, requestUpdateToDoAction({
            user,
            body: {
              id,
              boardId,
              text: textFieldValue.trim(),
            },
          }))
        } catch (err) {
          if (!isLoadError) {
            setIsLoadError(true)
          }
        }
      }
    },
    [isLoadError, dispacth, id, user, boardId, textFieldValue, toDoText],
  )

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

  const onDelete = useCallback(async () => {
    setIsDeleteDialogOpened(false)
    try {
      await createAsyncAction(dispacth, requestDeleteToDosAction({
        user,
        body: {
          boardId,
          todos: [id],
        },
      }))
    } catch (err) {
      if (!isLoadError) {
        setIsLoadError(true)
      }
    }
  }, [dispacth, id, user, boardId, isLoadError])

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

  const onClose = useCallback(() => {
    if (disabled) {
      return
    }
    onCloseProp()
    setTextFieldValue(toDoText)
  }, [onCloseProp, setTextFieldValue, toDoText, disabled])

  const text = toDoText.length < 60 ? toDoText : `${toDoText.substring(0, 57)}...`

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
          <FormControlLabel
            label={text}
            control={(
              <ComponentProgressBar loading={loadingPart === LoadingPart.CHECKBOX}>
                <Checkbox
                  disabled={disabled}
                  checked={done}
                  onChange={onStatusChange}
                />
              </ComponentProgressBar>
            )}
          />
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            multiline
            value={textFieldValue}
            onChange={onTextChange}
            disabled={disabled}
            className={classes.textField}
          />
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={(
              <ComponentProgressBar loading={loadingPart === LoadingPart.DELETE_BUTTON}>
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
              <ComponentProgressBar loading={loadingPart === LoadingPart.TEXT}>
                <SaveIcon />
              </ComponentProgressBar>
            )}
            variant="contained"
            color="primary"
            disabled={disabled}
            onClick={onSaveClick}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <DeleteConfirmDialog open={isDeleteDialogOpened} onCancel={onCancel} onDelete={onDelete} />
    </>
  )
}

export default EditToDoDialog
