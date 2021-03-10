import * as React from 'react'

import Alert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'

import SlideDown from './SlideDown'

interface Props {
  open: boolean
  onClose?(): void
  action?: React.ReactNode
  autoHide?: boolean
}

class ErrorSnackBar extends React.PureComponent<Props> {
  render() {
    const {
      open,
      onClose,
      children,
      action,
      autoHide,
    } = this.props

    return (
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
  }
}

export default ErrorSnackBar
