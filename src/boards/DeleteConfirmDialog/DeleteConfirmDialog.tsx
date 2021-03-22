import * as React from 'react'
import { FC } from 'react'

import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'

import DeleteIcon from '@material-ui/icons/Delete'

import DialogTitle from '../../common/DialogTitle'

interface Props {
  open: boolean
  onCancel: () => void
  onDelete: () => void
}

const DeleteConfirmDialog: FC<Props> = ({
  open,
  onCancel,
  onDelete,
}: Props) => (
  <Dialog
    open={open}
    fullWidth
    maxWidth="xs"
  >
    <DialogTitle>
      Are you sure?
    </DialogTitle>
    <DialogActions>
      <Button
        variant="outlined"
        color="primary"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        startIcon={<DeleteIcon />}
        variant="contained"
        color="secondary"
        onClick={onDelete}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
)

export default DeleteConfirmDialog
