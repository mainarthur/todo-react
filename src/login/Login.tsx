import * as React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import useStyle from '../common/authStyles'

import ErrorSnackBar from '../common/ErrorSnackBar'

import Link from '../routing/Link'
import { history } from '../routing/routerHistory'

import { api } from '../api/api'
import LoginBody from '../api/bodies/LoginBody'
import AuthResponse from '../api/responses/AuthResponse'

import { setAccessTokenAction, setRefreshTokenAction } from '../redux/actions/tokenActions'

import { isValidEmail, isValidPassword } from '../utils'
import onChange from '../common/onChange'
import validateTextFields from '../common/validateTextFields'

const Login: React.FC = () => {
  if (localStorage.getItem('access_token')) {
    history.push('/')
    return null
  }

  const classes = useStyle()

  const [emailState, setEmail] = useState('')
  const [passwordState, setPassword] = useState('')

  const [invalidEmail, setInvalidEmail] = useState(false)
  const [invalidPassword, setInvalidPassword] = useState(false)

  const [serverError, setServerError] = useState(false)

  const dispatch = useDispatch()

  const setAccessToken = (token: string) => {
    localStorage.setItem('access_token', token)
    dispatch(setAccessTokenAction(token))
  }
  const setRefreshToken = (token: string) => {
    localStorage.setItem('refresh_token', token)
    dispatch(setRefreshTokenAction(token))
  }

  const onEmailChange = onChange(
    () => invalidEmail,
    setEmail,
    setInvalidEmail,
    isValidEmail,
  )
  const onPasswordChange = onChange(
    () => invalidPassword,
    setPassword,
    setInvalidPassword,
    isValidPassword,
  )

  const onSnackBarClose = () => {
    if (serverError) {
      setServerError(false)
    }
  }

  const onLoginButtonClick = async () => {
    const email = emailState.trim()
    const password = passwordState.trim()

    if (!validateTextFields([{
      textFieldValue: email,
      error: invalidEmail,
      setError: setInvalidEmail,
      validator: isValidEmail,
    }, {
      textFieldValue: password,
      error: invalidPassword,
      setError: setInvalidPassword,
      validator: isValidPassword,
    }])) {
      return
    }

    const authResponse = await api<AuthResponse, LoginBody>({
      endpoint: '/auth/login',
      method: 'POST',
      body: {
        email, password,
      },
    })

    if (authResponse.status) {
      const auth = (authResponse as AuthResponse)
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
      } = auth

      setAccessToken(accessToken)
      setRefreshToken(refreshToken)

      if (serverError) {
        setServerError(false)
      }
      history.push('/')
    } else if (!serverError) {
      setServerError(true)
    }
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Grid item>
        <Paper className={classes.paper}>
          <Grid
            container
            alignItems="center"
            direction="column"
            spacing={2}
          >
            <Grid
              item
              className={classes.gridItem}
            >
              <TextField
                error={invalidEmail}
                helperText={invalidEmail && 'Invalid email format'}
                label="Email"
                placeholder="test@gmail.com"
                variant="outlined"
                className={classes.textField}
                value={emailState}
                onChange={onEmailChange}
              />
            </Grid>
            <Grid
              item
              className={classes.gridItem}
            >
              <TextField
                error={invalidPassword}
                helperText={invalidPassword && 'Password is too weak'}
                label="Password"
                variant="outlined"
                type="password"
                value={passwordState}
                className={classes.textField}
                onChange={onPasswordChange}
              />
            </Grid>
            <Grid
              item
              className={classes.buttonGrid}
            >
              <Button
                className={classes.button}
                variant="contained"
                color="secondary"
                onClick={onLoginButtonClick}
              >
                Login
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                <Link to="/register">Register </Link>
                <span>if you don&apos;t have an account yet.</span>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <ErrorSnackBar
        open={serverError}
        autoHide
        onClose={onSnackBarClose}
      >
        Login problem
      </ErrorSnackBar>
    </Grid>
  )
}

export default Login
