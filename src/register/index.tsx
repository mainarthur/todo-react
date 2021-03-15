import * as React from 'react'
import {
  useState,
  FC,
  useEffect,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

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

import { authClearAction, authRequestAction } from '../redux/actions/authActions'
import AuthBody from '../api/bodies/AuthBody'
import { AuthTypes } from '../redux/constants'
import { RootState } from '../redux/reducers'

const authType = AuthTypes.REGISTRATION

const Register: FC = () => {
  const classes = useStyle()

  const [nameState, setName] = useState('')
  const [emailState, setEmail] = useState('')
  const [passwordState, setPassword] = useState('')

  const [invalidName, setInvalidName] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [invalidPassword, setInvalidPassword] = useState(false)

  const { loading, error, ok } = useSelector((state: RootState) => state.auth[authType])

  const buttonDisabled = loading || ok

  const dispatch = useDispatch()

  const authRequest = useCallback((payload: AuthBody) => {
    dispatch(authRequestAction(payload, authType))
  }, [dispatch])

  const clearAuthState = useCallback(() => {
    dispatch(authClearAction(authType))
  }, [dispatch])

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

  const onNameChange = onChange(
    () => invalidName,
    setName,
    setInvalidName,
    isValidName,
  )

  const onSnackBarClose = () => {
    if (error) {
      clearAuthState()
    }
  }

  const onRegisterButtonClick = async () => {
    const name = nameState.trim()
    const email = emailState.trim()
    const password = passwordState.trim()

    if (!validateTextFields([{
      textFieldValue: name,
      error: invalidName,
      setError: setInvalidName,
      validator: isValidName,
    }, {
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

    authRequest({
      email,
      password,
      name,
    })
  }

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      history.push('/')
    }

    return () => {
      clearAuthState()
    }
  }, [clearAuthState])

  useEffect(() => {
    if (ok) {
      history.push('/')
    }
  }, [ok])

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
                error={invalidName}
                helperText={invalidName && 'Invalid name format'}
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
                error={invalidEmail}
                helperText={invalidEmail && 'Invalid email format'}
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
                <Link to="/login">Login</Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <ErrorSnackBar
        open={error}
        autoHide
        onClose={onSnackBarClose}
      >
        Registration Problem
      </ErrorSnackBar>
    </Grid>
  )
}

export default Register
