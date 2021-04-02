import * as React from 'react'
import { useEffect, FC, useState } from 'react'
import { useDispatch } from 'react-redux'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

import { io } from 'socket.io-client'

import useStyle from './styles'

import { history } from './routing/routerHistory'

import { setAccessTokenAction, setRefreshTokenAction } from './redux/actions/tokenActions'
import { requestUserAction, setUserAction } from './redux/actions/appActions'
import { createAsyncAction } from './redux/helpers'
import User from './models/User'
import BoardPage from './boards/BoardPage'
import { initSocket } from './socket.io'
import useUser from './hooks/useUser'
import useAuthTokens from './hooks/useAuthTokens'

const ENDPOINT = 'http://api.todolist.local'

const App: FC = () => {
  const classes = useStyle()

  const [isLoading, setIsLoading] = useState(false)

  const user = useUser()
  const { refreshToken, accessToken } = useAuthTokens()

  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem('access_token') == null) {
      history.push('/login')
    } else {
      if (accessToken === '' || refreshToken === '') {
        dispatch(setAccessTokenAction(localStorage.getItem('access_token')))
        dispatch(setRefreshTokenAction(localStorage.getItem('refresh_token')))
      }
      if (!user && !isLoading) {
        setIsLoading(true);
        (async () => {
          try {
            const loadedUser = await createAsyncAction<User>(dispatch, requestUserAction())
            dispatch(setUserAction(loadedUser))
          } finally {
            setIsLoading(false)
          }
        })()
      }
    }
  }, [accessToken, refreshToken, user, isLoading, dispatch])

  useEffect(() => {
    const socket = io(ENDPOINT, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    socket.on('connected', () => {

    })

    initSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [accessToken])

  if (!user || isLoading) {
    return (
      <Grid
        className={classes.rootProgressBar}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <CircularProgress size="10rem" />
        </Grid>
      </Grid>
    )
  }

  return (
    <Box className={classes.root}>
      <main className={classes.content}>
        <BoardPage />
      </main>
    </Box>
  )
}

export default App
