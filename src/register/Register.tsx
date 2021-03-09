import * as React from 'react'
import { connect } from 'react-redux'
import Alert from '@material-ui/lab/Alert'
import {
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
  WithStyles,
  Button,
  withStyles,
} from '@material-ui/core'
import { api } from '../api/api'
import RegisterBody from '../api/bodies/RegisterBody'
import AuthResponse from '../api/responses/AuthResponse'
import {
  changeEmailAction,
  changeNameAction,
  changePasswordAction,
  toggleEmailValidationAction,
  toggleNameValidationAction,
  togglePasswordValidationAction,
  toggleServerErrorAction,
} from '../redux/actions/authActions'
import { AuthMethod } from '../redux/constants'
import { RootState } from '../redux/reducers'
import { RegisterState } from '../redux/reducers/registerReducer'
import Link from '../routing/Link'
import { history } from '../routing/RouterContext'
import { isValidEmail, isValidName, isValidPassword } from '../utils'
import styles, { StyleProps } from '../common/authStyles'
import { setAccessTokenAction, setRefreshTokenAction } from '../redux/actions/tokenActions'

interface DispatchProps {
  changeEmail: typeof changeEmailAction
  changePassword: typeof changePasswordAction
  changeName: typeof changeNameAction
  toggleEmailValidation: typeof toggleEmailValidationAction
  togglePasswordValidation: typeof togglePasswordValidationAction
  toggleNameValidation: typeof toggleNameValidationAction
  toggleSeverError: typeof toggleServerErrorAction
  setAccessToken: typeof setAccessTokenAction
  setRefreshToken: typeof setRefreshTokenAction
}

type Props = RegisterState & DispatchProps & StyleProps

class Register extends React.Component<Props> {
  constructor(props: Props | Readonly<Props>) {
    super(props)
    if (localStorage.getItem('access_token')) {
      history.push('/')
    }
  }

  onRegisterButtonClick = async (): Promise<void> => {
    const {
      invalidName,
      invalidEmail,
      invalidPassword,
      serverError,
      email: stateEmail,
      password: statePassword,
      name: stateName,
      toggleEmailValidation,
      togglePasswordValidation,
      toggleSeverError,
      toggleNameValidation,
      setAccessToken,
      setRefreshToken,
    } = this.props

    const email = stateEmail.trim()
    const name = stateName.trim()
    const password = statePassword.trim()

    if (!isValidName(name)) {
      if (!invalidName) {
        toggleNameValidation(AuthMethod.REGISTRATION)
      }
      return
    } if (invalidName) {
      toggleNameValidation(AuthMethod.REGISTRATION)
    }

    if (!isValidEmail(email)) {
      if (!invalidEmail) {
        toggleEmailValidation(AuthMethod.REGISTRATION)
      }
      return
    } if (invalidEmail) {
      toggleEmailValidation(AuthMethod.REGISTRATION)
    }

    if (!isValidPassword(password)) {
      if (!invalidPassword) {
        togglePasswordValidation(AuthMethod.REGISTRATION)
      }
      return
    } if (invalidPassword) {
      togglePasswordValidation(AuthMethod.REGISTRATION)
    }

    const authResponse = await api<AuthResponse, RegisterBody>({
      endpoint: '/auth/register',
      method: 'POST',
      body: {
        email, password, name,
      },
    })

    if (authResponse.status) {
      const auth = (authResponse as AuthResponse)
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
      } = auth

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)

      history.push('/')
      if (serverError) {
        toggleSeverError(AuthMethod.REGISTRATION)
      }
    } else if (serverError) {
      toggleSeverError(AuthMethod.REGISTRATION)
    }
  }

  onEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { changeEmail, invalidEmail, toggleEmailValidation } = this.props
    const { target: { value } } = ev

    if (value === '' && invalidEmail) {
      toggleEmailValidation(AuthMethod.REGISTRATION)
    }

    changeEmail(value, AuthMethod.REGISTRATION)
  }

  onPasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { changePassword, invalidPassword, togglePasswordValidation } = this.props
    const { target: { value } } = ev

    if (value === '' && invalidPassword) {
      togglePasswordValidation(AuthMethod.REGISTRATION)
    }

    changePassword(value, AuthMethod.REGISTRATION)
  }

  onSnackBarClose = () => {
    const { toggleSeverError, serverError } = this.props

    if (serverError) {
      toggleSeverError(AuthMethod.REGISTRATION)
    }
  }

  onNameChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    const { changeName } = this.props

    changeName(ev.target.value, AuthMethod.REGISTRATION)
  };

  render(): JSX.Element {
    const {
      invalidEmail,
      invalidName,
      invalidPassword,
      serverError,
      classes,
    } = this.props

    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.root}
      >
        <Grid
          item
        >
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
                  className={classes.textField}
                  onChange={this.onNameChange}
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
                  className={classes.textField}
                  onChange={this.onEmailChange}
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
                  className={classes.textField}
                  onChange={this.onPasswordChange}
                />
              </Grid>
              <Grid item className={classes.buttonGrid}>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  onClick={this.onRegisterButtonClick}
                >
                  Register
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
        <Snackbar
          open={serverError}
          autoHideDuration={4000}
          onClose={this.onSnackBarClose}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity="error"
            onClose={this.onSnackBarClose}
          >
            Registration problem
          </Alert>
        </Snackbar>
      </Grid>
    )
  }
}
const mapStateToProps = (state: RootState): RegisterState => ({ ...state.register })

const mapDispatchToProps: DispatchProps = {
  changeEmail: changeEmailAction,
  changePassword: changePasswordAction,
  changeName: changeNameAction,
  toggleEmailValidation: toggleEmailValidationAction,
  togglePasswordValidation: togglePasswordValidationAction,
  toggleSeverError: toggleServerErrorAction,
  toggleNameValidation: toggleNameValidationAction,
  setAccessToken: setAccessTokenAction,
  setRefreshToken: setRefreshTokenAction,
}

export default connect<RegisterState, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Register))
