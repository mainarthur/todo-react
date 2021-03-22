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

import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'

import DialogTitle from '../../common/DialogTitle'

import DeleteConfirmDialog from '../DeleteConfirmDialog'
import ToDo from '../../models/ToDo'

import { createAsyncAction } from '../../redux/helpers'
import { requestUpdateToDoAction } from '../../redux/actions/toDoActions'
import { RootState } from '../../redux/reducers'

interface Props {
  toDo: ToDo
  open: boolean
  onClose: () => void
}

const EditToDoDialog: FC<Props> = ({
  toDo,
  open,
  onClose,
}: Props) => {
  const {
    done,
    text: toDoText,
    id,
    boardId,
    loadingPart,
  } = toDo

  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)
  const [isLoadError, setIsLoadError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useSelector((state: RootState) => state.app)
  const dispacth = useDispatch()

  const onOpenDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpened(true)
  }, [])

  const onCancel = useCallback(() => {
    setIsDeleteDialogOpened(false)
  }, [])

  const onDelete = useCallback(() => {
    setIsDeleteDialogOpened(false)
  }, [])

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
              <Checkbox
                checked={done}
                onChange={onStatusChange}
              />
            )}
          />
        </DialogTitle>
        <DialogContent dividers>
          {toDoText}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="secondary"
            onClick={onOpenDeleteDialog}
          >
            Delete
          </Button>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
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
