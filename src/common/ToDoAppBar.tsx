import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import { deleteTokensAction } from '../redux/actions/tokenActions'
import { RootState } from '../redux/reducers'

import { history } from '../routing/RouterContext'
import useStyle from './ToDoAppBarStyles'

const ToDoAppBar: React.FC = () => {
  const classes = useStyle()
  const { accessToken } = useSelector((state: RootState) => state.tokens)
  const dispatch = useDispatch()

  const onLogOutClick = () => {
    dispatch(deleteTokensAction())
    localStorage.clear()
    history.push('/login')
  }

  return (
    <AppBar>
      <Toolbar className={classes.toolBar}>
        <Typography className={classes.title} variant="h5">
          To-Do List
        </Typography>
        {accessToken !== '' ? (
          <IconButton onClick={onLogOutClick}>
            <ExitToAppIcon className={classes.logOutIcon} />
          </IconButton>
        ) : null}
      </Toolbar>
    </AppBar>
  )
}

export default ToDoAppBar
