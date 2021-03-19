import * as React from 'react'
import { FC } from 'react'

import IconButton from '@material-ui/core/IconButton'

import ReloadIcon from '@material-ui/icons/Cached'
import useStyle from './styles'

interface Props {
  onReloadClick(): void
}

const ReloadButton: FC<Props> = ({ onReloadClick: onReloadTodosClick }: Props) => {
  const classes = useStyle()

  return (
    <IconButton onClick={onReloadTodosClick}>
      <ReloadIcon className={classes.reloadIcon} />
    </IconButton>
  )
}

export default ReloadButton
