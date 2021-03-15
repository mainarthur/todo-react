import * as React from 'react'
import { useEffect, FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import useStyle from './AppStyles'

import NewToDo from './todo/NewToDo'
import ToDoList from './todo/ToDoList'

import { history } from './routing/routerHistory'

import setUserAction from './redux/actions/appActions'
import { RootState } from './redux/reducers'

import User from './models/User'

import { setAccessTokenAction, setRefreshTokenAction } from './redux/actions/tokenActions'

const App: FC = () => {
  const classes = useStyle()

  const { user } = useSelector((state: RootState) => state.app)
  const tokens = useSelector((state: RootState) => state.tokens)

  const dispatch = useDispatch()

  const setUser = (newUser: User) => dispatch(setUserAction(newUser))
  const setAccessToken = (token: string) => dispatch(setAccessTokenAction(token))
  const setRefreshToken = (token: string) => dispatch(setRefreshTokenAction(token))

  useEffect(() => {
    if (localStorage.getItem('access_token') == null) {
      history.push('/login')
    } else {
      if (tokens.accessToken === '' || tokens.refreshToken === '') {
        setAccessToken(localStorage.getItem('access_token'))
        setRefreshToken(localStorage.getItem('refresh_token'))
      }
      if (!user) {

      }

      return () => {
        setUser(null)
      }
    }
  }, [])

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
