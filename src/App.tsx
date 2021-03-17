import * as React from 'react'
import { useEffect, FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import { io } from 'socket.io-client'
import useStyle from './styles'

import NewToDo from './todo/NewToDo'
import ToDoList from './todo/ToDoList'

import { history } from './routing/routerHistory'

import { RootState } from './redux/reducers'

import { setAccessTokenAction, setRefreshTokenAction } from './redux/actions/tokenActions'
import { requestUserAction, setUserAction } from './redux/actions/appActions'
import { createAsyncAction } from './redux/helpers'
import User from './models/User'

const ENDPOINT = 'http://api.todolist.local'

const App: FC = () => {
  const classes = useStyle()

  const [loading, setLoading] = useState(false)

  const { user } = useSelector((state: RootState) => state.app)
  const { refreshToken, accessToken } = useSelector((state: RootState) => state.tokens)

  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem('access_token') == null) {
      history.push('/login')
    } else {
      if (accessToken === '' || refreshToken === '') {
        dispatch(setAccessTokenAction(localStorage.getItem('access_token')))
        dispatch(setRefreshTokenAction(localStorage.getItem('refresh_token')))
      }
      if (!user && !loading) {
        setLoading(true);
        (async () => {
          try {
            const loadedUser = await createAsyncAction<User>(dispatch, requestUserAction())
            dispatch(setUserAction(loadedUser))
          } finally {
            setLoading(false)
          }
        })()
      }
    }
  }, [accessToken, refreshToken, user, loading, dispatch])

  const [response, setResponse] = useState('')

  useEffect(() => {
    const socket = io(ENDPOINT, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    socket.on('dataTime', (data) => {
      console.log(data)
      setResponse(data)
    })

    return () => {
      socket.disconnect()
    }
  }, [accessToken])

  return (
    <Box>
      <Toolbar />
      <p>
        It&apos;s
        {response}
      </p>
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
