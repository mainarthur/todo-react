import * as React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { api } from '../api/api'
import LoginBody from '../api/bodies/LoginBody'
import AuthResponse from '../api/responses/AuthResponse'
import Card from '../common/Card'
import ErrorLabel from '../common/ErrorLabel'
import TextField from '../common/TextField'
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

interface LoginStateProps {
  email: string
  password: string
  invalidEmail: boolean
  invalidPassword: boolean
  serverError: boolean
}

interface DispatchProps {
  changeEmail: typeof changeEmailAction
  changePassword: typeof changePasswordAction
  toggleEmailValidation: typeof toggleEmailValidationAction
  togglePasswordValidation: typeof togglePasswordValidationAction
  toggleSeverError: typeof toggleServerErrorAction
}

type Props = LoginStateProps & DispatchProps

class Login extends React.Component<Props> {
  componentDidMount() {
    if (localStorage.getItem('access_token')) {
      history.push('/')
    }
  }

  onLoginButtonClick = async (): Promise<void> => {
    const {
      invalidEmail,
      invalidPassword,
      serverError,
      email: propEmail,
      password: propPassword,
      toggleEmailValidation,
      togglePasswordValidation,
      toggleSeverError,
    } = this.props

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
      localStorage.setItem('access_token', (authResponse as AuthResponse).access_token)
      localStorage.setItem('refresh_token', (authResponse as AuthResponse).refresh_token)

      if (serverError) {
        toggleSeverError(AuthMethod.LOGIN)
      }
      history.push('/')
    } else if (!serverError) {
      toggleSeverError(AuthMethod.LOGIN)
    }
  };

  onEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { changeEmail } = this.props

    changeEmail(ev.target.value, AuthMethod.LOGIN)
  };

  onPasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { changePassword } = this.props

    changePassword(ev.target.value, AuthMethod.LOGIN)
  };

  render(): JSX.Element {
    const { invalidEmail, invalidPassword, serverError } = this.props

    return (
      <Card>
        <TextField
          className="login__email"
          id="email"
          placeholder="Email"
          invalid={invalidEmail}
          errorText="Ivalid email format"
          onChange={this.onEmailChange}
        />
        <TextField
          className="login__password"
          type="password"
          id="password"
          placeholder="Password"
          invalid={invalidPassword}
          errorText="Password is too weak"
          onChange={this.onPasswordChange}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={this.onLoginButtonClick}
        >
          Login
        </Button>
        <ErrorLabel
          className="login__error-label"
          invalid={serverError}
        >
          Login Problem: invalid email or password
        </ErrorLabel>
        <p>
          <Link to="/register">Register </Link>
          if you don&apos;t have an account yet.
        </p>
      </Card>
    )
  }
}

const mapStateToProps = (state: RootState): LoginStateProps => ({ ...state.login })

const mapDispatchToProps = {
  changeEmail: changeEmailAction,
  changePassword: changePasswordAction,
  toggleEmailValidation: toggleEmailValidationAction,
  togglePasswordValidation: togglePasswordValidationAction,
  toggleSeverError: toggleServerErrorAction,
}

export default connect<LoginStateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(Login)
