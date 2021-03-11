import * as React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import useStyle from './AppStyles'

import NewToDo from './todo/NewToDo'
import ToDoList from './todo/ToDoList'

import { history } from './routing/routerHistory'

import { api, refreshTokens } from './api/api'
import UserResponse from './api/responses/UserResponse'

import setUserAction from './redux/actions/appActions'
import { RootState } from './redux/reducers'

import User from './models/User'

import { err } from './logging/logger'

const App: React.FC = () => {
  if (localStorage.getItem('access_token') == null) {
    history.push('/login')
    return null
  }

  const classes = useStyle()

  const { user } = useSelector((state: RootState) => state.app)
  const dispatch = useDispatch()

  const setUser = (newUser: User) => dispatch(setUserAction(newUser))

  useEffect(() => {
    (async () => {
      try {
        await refreshTokens()
        if (!user) {
          const userResponse = await api<UserResponse, {}>({
            endpoint: '/user',
          })

          if (userResponse.status) {
            setUser((userResponse as UserResponse).result)
          } else if (user) {
            setUser(null)
          }
        }
      } catch (e) {
        err(e)
      }
    })()

    return () => {
      setUser(null)
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
