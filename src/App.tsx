import * as React from 'react'
import { useEffect, FC, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import useStyle from './AppStyles'

import NewToDo from './todo/NewToDo'
import ToDoList from './todo/ToDoList'

import { history } from './routing/routerHistory'

import { RootState } from './redux/reducers'

import { setAccessTokenAction, setRefreshTokenAction } from './redux/actions/tokenActions'
import { setUserAction, userRequestAction } from './redux/actions/appActions'
import User from './models/User'

const App: FC = () => {
  const classes = useStyle()

  const { user } = useSelector((state: RootState) => state.app)
  const { refreshToken, accessToken } = useSelector((state: RootState) => state.tokens)

  const dispatch = useDispatch()

  const userRequest = useCallback(() => dispatch(userRequestAction()), [dispatch])
  const setUser = useCallback((newUser: User) => dispatch(setUserAction(newUser)), [dispatch])
  const setAccessToken = useCallback(
    (token: string) => dispatch(setAccessTokenAction(token)),
    [dispatch],
  )
  const setRefreshToken = useCallback(
    (token: string) => dispatch(setRefreshTokenAction(token)),
    [dispatch],
  )

  useEffect(() => {
    if (localStorage.getItem('access_token') == null) {
      history.push('/login')
    } else {
      if (accessToken === '' || refreshToken === '') {
        setAccessToken(localStorage.getItem('access_token'))
        setRefreshToken(localStorage.getItem('refresh_token'))
      }
      if (!user) {
        userRequest()
      }
    }
    return () => {
      setUser(null)
    }
  }, [user, refreshToken, accessToken, setUser, setRefreshToken, setAccessToken, userRequest])

  return (
    <Box>
      <Toolbar />
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        spacing={3}
        className={classes.root}
      >
        <NewToDo />
        <ToDoList user={user} />
      </Grid>
    </Box>
  )
}

export default App
