import * as React from 'react'

import IconButton from '@material-ui/core/IconButton'

import ReloadIcon from '@material-ui/icons/Cached'
import useStyle from './ReloadButtonStyles'

interface Props {
  onReloadTodosClick(): void
}

const ReloadButton: React.FC<Props> = ({ onReloadTodosClick }: Props) => {
  const classes = useStyle()

  return (
    <IconButton onClick={onReloadTodosClick}>
      <ReloadIcon className={classes.reloadIcon} />
    </IconButton>
  )
}

export default ReloadButton
