import * as React from 'react'
import { ReactNode, FC } from 'react'

import Alert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'

import SlideDown from './SlideDown'

interface Props {
  open: boolean
  children?: ReactNode
  onClose?(): void
  action?: ReactNode
  autoHide?: boolean
}

const ErrorSnackBar: FC<Props> = ({
  open,
  onClose,
  children,
  action,
  autoHide,
}: Props) => (
  <Snackbar
    open={open}
    autoHideDuration={autoHide ? 4000 : null}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    TransitionComponent={SlideDown}
  >
    <Alert
      elevation={6}
      variant="filled"
      severity="error"
      action={action}
      onClose={onClose}
    >
      {children}
    </Alert>
  </Snackbar>
)

ErrorSnackBar.defaultProps = {
  children: null,
  onClose: () => null,
  action: null,
  autoHide: false,
}

export default ErrorSnackBar
