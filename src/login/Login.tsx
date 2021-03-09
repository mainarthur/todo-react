import * as React from 'react'
import { connect } from 'react-redux'
import Alert from '@material-ui/lab/Alert'
import {
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
  withStyles,
  Button,
} from '@material-ui/core'
import { api } from '../api/api'
import LoginBody from '../api/bodies/LoginBody'
import AuthResponse from '../api/responses/AuthResponse'
import { AuthMethod } from '../redux/constants'
import { RootState } from '../redux/reducers'
import {
  changeEmailAction,
  changePasswordAction,
  toggleEmailValidationAction,
  togglePasswordValidationAction,
  toggleServerErrorAction,
} from '../redux/actions/authActions'
import Link from '../routing/Link'
import { history } from '../routing/RouterContext'
import { isValidEmail, isValidPassword } from '../utils'
import { setAccessTokenAction, setRefreshTokenAction } from '../redux/actions/tokenActions'
import { LoginState } from '../redux/reducers/loginReducer'
import { TokensState } from '../redux/reducers/tokensReducer'
import styles, { StyleProps } from '../common/authStyles'

interface LoginStateProps {
  login: LoginState,
  tokens: TokensState
}

interface DispatchProps {
  changeEmail: typeof changeEmailAction
  changePassword: typeof changePasswordAction
  toggleEmailValidation: typeof toggleEmailValidationAction
  togglePasswordValidation: typeof togglePasswordValidationAction
  toggleSeverError: typeof toggleServerErrorAction
  setAccessToken: typeof setAccessTokenAction
  setRefreshToken: typeof setRefreshTokenAction
}

type Props = LoginStateProps & DispatchProps & StyleProps

class Login extends React.Component<Props> {
  componentDidMount() {
    if (localStorage.getItem('access_token')) {
      history.push('/')
    }
  }

  onLoginButtonClick = async (): Promise<void> => {
    const {
      toggleEmailValidation,
      togglePasswordValidation,
      toggleSeverError,
      setAccessToken,
      setRefreshToken,
      login,
    } = this.props

    const {
      invalidEmail,
      invalidPassword,
      serverError,
      email: propEmail,
      password: propPassword,
    } = login

    const email = propEmail.trim()
    const password = propPassword.trim()

    if (!isValidEmail(email)) {
      if (!invalidEmail) {
        toggleEmailValidation(AuthMethod.LOGIN)
      }
      return
    } if (invalidEmail) {
      toggleEmailValidation(AuthMethod.LOGIN)
    }

    if (!isValidPassword(password)) {
      if (!invalidPassword) {
        togglePasswordValidation(AuthMethod.LOGIN)
      }
      return
    } if (invalidPassword) {
      togglePasswordValidation(AuthMethod.LOGIN)
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

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)

      if (serverError) {
        toggleSeverError(AuthMethod.LOGIN)
      }
      history.push('/')
    } else if (!serverError) {
      toggleSeverError(AuthMethod.LOGIN)
    }
  }

  onEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { changeEmail, login, toggleEmailValidation } = this.props
    const { invalidEmail } = login
    const { target: { value } } = ev

    if (value === '' && invalidEmail) {
      toggleEmailValidation(AuthMethod.LOGIN)
    }

    changeEmail(value, AuthMethod.LOGIN)
  }

  onPasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { changePassword, login, togglePasswordValidation } = this.props
    const { invalidPassword } = login
    const { target: { value } } = ev

    if (value === '' && invalidPassword) {
      togglePasswordValidation(AuthMethod.LOGIN)
    }

    changePassword(value, AuthMethod.LOGIN)
  }

  onSnackBarClose = () => {
    const { login, toggleSeverError } = this.props
    const { serverError } = login

    if (serverError) {
      toggleSeverError(AuthMethod.LOGIN)
    }
  }

  render(): JSX.Element {
    const { login, classes } = this.props
    const { invalidEmail, invalidPassword, serverError } = login

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
                  error={invalidEmail}
                  helperText={invalidEmail && 'Invalid email format'}
                  label="Email"
                  placeholder="test@gmail.com"
                  variant="outlined"
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
              <Grid
                item
                className={classes.buttonGrid}
              >
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  onClick={this.onLoginButtonClick}
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
            Login problem
          </Alert>
        </Snackbar>
      </Grid>
    )
  }
}

const mapStateToProps = (state: RootState): LoginStateProps => ({
  login: state.login,
  tokens: state.tokens,
})

const mapDispatchToProps: DispatchProps = {
  changeEmail: changeEmailAction,
  changePassword: changePasswordAction,
  toggleEmailValidation: toggleEmailValidationAction,
  togglePasswordValidation: togglePasswordValidationAction,
  toggleSeverError: toggleServerErrorAction,
  setAccessToken: setAccessTokenAction,
  setRefreshToken: setRefreshTokenAction,
}

export default connect<LoginStateProps, DispatchProps>(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(Login))
