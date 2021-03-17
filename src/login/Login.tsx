import * as React from 'react'
import {
  useState,
  FC,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
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

import { isValidEmail, isValidPassword } from '../utils'
import onChange from '../common/onChange'
import validateTextFields from '../common/validateTextFields'

import { loginRequestAction } from '../redux/actions/authActions'
import { RequestStatus } from '../redux/constants'
import { createAsyncAction } from '../redux/helpers'
import ComponentProgressBar from '../common/ComponentProgressBar'

const Login: FC = () => {
  const classes = useStyle()

  const [emailState, setEmail] = useState('')
  const [passwordState, setPassword] = useState('')

  const [isInvalidEmail, setIsInvalidEmail] = useState(false)
  const [isInvalidPassword, setIsInvalidPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NONE)

  const dispatch = useDispatch()

  const buttonsDisabled = isLoading || requestStatus === RequestStatus.OK

  const onEmailChange = useMemo(() => onChange(
    () => isInvalidEmail,
    setEmail,
    setIsInvalidEmail,
    isValidEmail,
  ), [isInvalidEmail])

  const onPasswordChange = useMemo(() => onChange(
    () => isInvalidPassword,
    setPassword,
    setIsInvalidPassword,
    isValidPassword,
  ), [isInvalidPassword])

  const onSnackBarClose = useCallback(() => {
    if (requestStatus === RequestStatus.ERROR) {
      setRequestStatus(RequestStatus.NONE)
    }
  }, [requestStatus])

  const onLoginButtonClick = useCallback(async () => {
    const email = emailState.trim()
    const password = passwordState.trim()

    if (!validateTextFields([{
      textFieldValue: email,
      error: isInvalidEmail,
      setError: setIsInvalidEmail,
      validator: isValidEmail,
    }, {
      textFieldValue: password,
      error: isInvalidPassword,
      setError: setIsInvalidPassword,
      validator: isValidPassword,
    }])) {
      return
    }

    try {
      setIsLoading(true)
      await createAsyncAction(dispatch, loginRequestAction({
        email,
        password,
      }))
      setRequestStatus(RequestStatus.OK)
    } catch (err) {
      setRequestStatus(RequestStatus.ERROR)
    } finally {
      setIsLoading(false)
    }
  }, [
    emailState,
    passwordState,
    isInvalidEmail,
    isInvalidPassword,
    dispatch,
  ])

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      history.push('/')
    }
  })

  useEffect(() => {
    if (requestStatus === RequestStatus.OK) {
      history.push('/')
    }
  }, [requestStatus])

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
                error={isInvalidEmail}
                helperText={isInvalidEmail && 'Invalid email format'}
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
                error={isInvalidPassword}
                helperText={isInvalidPassword && 'Password is too weak'}
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
                disabled={buttonsDisabled}
              >
                Login
                <ComponentProgressBar loading={isLoading} className={classes.progressBar} />
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                <Link disabled={buttonsDisabled} to="/register">Register </Link>
                <span>if you don&apos;t have an account yet.</span>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <ErrorSnackBar
        open={requestStatus === RequestStatus.ERROR}
        autoHide
        onClose={onSnackBarClose}
      >
        Login problem
      </ErrorSnackBar>
    </Grid>
  )
}

export default Login
