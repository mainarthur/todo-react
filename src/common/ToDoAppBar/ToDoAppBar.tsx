import * as React from 'react'
import { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import { deleteTokensAction } from '../../redux/actions/tokenActions'

import { history } from '../../routing/routerHistory'
import useStyle from './styles'
import { getDatabaseName } from '../../indexeddb/connect'
import useUser from '../../hooks/useUser'
import useAuthTokens from '../../hooks/useAuthTokens'

const ToDoAppBar: FC = () => {
  const classes = useStyle()
  const { accessToken } = useAuthTokens()
  const user = useUser()
  const dispatch = useDispatch()

  const onLogOutClick = useCallback(() => {
    indexedDB.deleteDatabase(getDatabaseName(user.id))
    Object.keys(localStorage).forEach((key) => {
      if (key.indexOf('lastUpdate-todos-') === 0) {
        indexedDB.deleteDatabase(getDatabaseName(user.id, key.substring('lastUpdate-todos-'.length)))
      }
    })
    dispatch(deleteTokensAction())
    localStorage.clear()
    history.push('/login')
  }, [dispatch, user])

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
