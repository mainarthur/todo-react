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
import CircularProgress from '@material-ui/core/CircularProgress'

import useStyle from '../common/authStyles'

import ErrorSnackBar from '../common/ErrorSnackBar'

import Link from '../routing/Link'
import { history } from '../routing/routerHistory'

import { isValidEmail, isValidPassword, isValidName } from '../utils'
import onChange from '../common/onChange'
import validateTextFields from '../common/validateTextFields'

import { registerRequestAction } from '../redux/actions/authActions'
import { RequestStatus } from '../redux/constants'
import { createAsyncAction } from '../redux/helpers'

const Register: FC = () => {
  const classes = useStyle()

  const [nameState, setName] = useState('')
  const [emailState, setEmail] = useState('')
  const [passwordState, setPassword] = useState('')

  const [isInvalidName, setIsInvalidName] = useState(false)
  const [isInvalidEmail, setIsInvalidEmail] = useState(false)
  const [isInvalidPassword, setIsInvalidPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NONE)

  const dispatch = useDispatch()

  const buttonDisabled = loading || requestStatus === RequestStatus.OK

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

  const onNameChange = useMemo(() => onChange(
    () => isInvalidName,
    setName,
    setIsInvalidName,
    isValidName,
  ), [isInvalidName])

  const onSnackBarClose = useCallback(() => {
    if (requestStatus === RequestStatus.ERROR) {
      setRequestStatus(RequestStatus.NONE)
    }
  }, [requestStatus])

  const onRegisterButtonClick = useCallback(async () => {
    const name = nameState.trim()
    const email = emailState.trim()
    const password = passwordState.trim()

    if (!validateTextFields([{
      textFieldValue: name,
      error: isInvalidName,
      setError: setIsInvalidName,
      validator: isValidName,
    }, {
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
      setLoading(true)
      await createAsyncAction(dispatch, registerRequestAction({
        name,
        email,
        password,
      }))
      setRequestStatus(RequestStatus.OK)
    } catch (err) {
      setRequestStatus(RequestStatus.ERROR)
    } finally {
      setLoading(false)
    }
  }, [
    nameState,
    emailState,
    passwordState,
    isInvalidName,
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
                error={isInvalidName}
                helperText={isInvalidName && 'Invalid name format'}
                label="Name"
                placeholder="Mike"
                variant="outlined"
                type="name"
                value={nameState}
                className={classes.textField}
                onChange={onNameChange}
              />
            </Grid>
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
                type="email"
                value={emailState}
                className={classes.textField}
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
            <Grid item className={classes.buttonGrid}>
              <Button
                className={classes.button}
                variant="contained"
                color="secondary"
                onClick={onRegisterButtonClick}
                disabled={buttonDisabled}
              >
                Register
                {loading && <CircularProgress size="1.5rem" className={classes.progressBar} />}
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                <span>Already have an account?</span>
                <Link disabled={buttonDisabled} to="/login">Login</Link>
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
        Registration Problem
      </ErrorSnackBar>
    </Grid>
  )
}

export default Register
