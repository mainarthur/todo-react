import * as React from 'react'
import { connect } from 'react-redux'

import Alert from '@material-ui/lab/Alert'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import withStyles from '@material-ui/core/styles/withStyles'
import styles, { StyleProps } from '../common/authStyles'

import Link from '../routing/Link'
import { history } from '../routing/RouterContext'

import { api } from '../api/api'
import LoginBody from '../api/bodies/LoginBody'
import AuthResponse from '../api/responses/AuthResponse'

import { setAccessTokenAction, setRefreshTokenAction } from '../redux/actions/tokenActions'

import { isValidEmail, isValidPassword } from '../utils'

type State = {
  email: string
  password: string
  invalidEmail: boolean
  invalidPassword: boolean
  serverError: boolean
}

interface DispatchProps {
  setAccessToken: typeof setAccessTokenAction
  setRefreshToken: typeof setRefreshTokenAction
}

type Props = DispatchProps & StyleProps

class Login extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props)

    this.state = {
      email: '',
      password: '',
      invalidEmail: false,
      invalidPassword: false,
      serverError: false,
    }
  }

  componentDidMount() {
    if (localStorage.getItem('access_token')) {
      history.push('/')
    }
  }

  onLoginButtonClick = async (): Promise<void> => {
    const {
      setAccessToken,
      setRefreshToken,
    } = this.props

    const {
      invalidEmail,
      invalidPassword,
      serverError,
      email: stateEmail,
      password: statePassword,
    } = this.state

    const email = stateEmail.trim()
    const password = statePassword.trim()

    if (!isValidEmail(email)) {
      if (!invalidEmail) {
        this.setState({
          invalidEmail: true,
        })
      }
      return
    } if (invalidEmail) {
      this.setState({
        invalidEmail: false,
      })
    }

    if (!isValidPassword(password)) {
      if (!invalidPassword) {
        this.setState({
          invalidPassword: true,
        })
      }
      return
    } if (invalidPassword) {
      this.setState({
        invalidPassword: false,
      })
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
        this.setState({
          serverError: false,
        })
      }
      history.push('/')
    } else if (!serverError) {
      this.setState({
        serverError: true,
      })
    }
  }

  onEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { invalidEmail } = this.state
    const { target: { value } } = ev

    if (invalidEmail && (value === '' || isValidEmail(value))) {
      this.setState({
        invalidEmail: false,
      })
    }

    this.setState({
      email: value,
    })
  }

  onPasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { invalidPassword } = this.state
    const { target: { value } } = ev

    if (invalidPassword && (value === '' || isValidPassword(value))) {
      this.setState({
        invalidPassword: false,
      })
    }

    this.setState({
      password: value,
    })
  }

  onSnackBarClose = () => {
    const { serverError } = this.state

    if (serverError) {
      this.setState({
        serverError: false,
      })
    }
  }

  render(): JSX.Element {
    const { classes } = this.props
    const { invalidEmail, invalidPassword, serverError } = this.state

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

const mapStateToProps = () => ({})

const mapDispatchToProps: DispatchProps = {
  setAccessToken: setAccessTokenAction,
  setRefreshToken: setRefreshTokenAction,
}

export default connect<{}, DispatchProps>(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(Login))
