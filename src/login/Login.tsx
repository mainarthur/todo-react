import * as React from 'react';
import { api } from '../api/api';
import LoginBody from '../api/bodies/LoginBody';
import AuthResponse from '../api/responses/AuthResponse';
import Button from '../common/Button';
import Card from '../common/Card';
import ErrorLabel from '../common/ErrorLabel';
import TextField from '../common/TextField';
import Link from '../routing/Link';
import { history } from '../routing/RouterContext';
import { isValidEmail, isValidPassword } from '../utils';
import './Login.scss';

type LoginState = {
  email: string;
  password: string;
  invalidEmail: boolean;
  invalidPassword: boolean;
  serverError: boolean;
};

class Login extends React.Component<{}, LoginState> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      email: '',
      password: '',
      invalidEmail: false,
      invalidPassword: false,
      serverError: false,
    };
  }

  componentDidMount() {
    if (localStorage.getItem('access_token')) {
      history.push('/');
    }
  }

  async onLoginButtonClick(): Promise<void> {
    let {
      email, password,
    } = this.state;

    const {
      invalidEmail, invalidPassword, serverError,
    } = this.state;

    email = email.trim();
    password = password.trim();

    if (!isValidEmail(email)) {
      return this.setState({
        invalidEmail: true,
      });
    } if (invalidEmail) {
      this.setState({
        invalidEmail: false,
      });
    }

    if (!isValidPassword(password)) {
      return this.setState({
        invalidPassword: true,
      });
    } if (invalidPassword) {
      this.setState({
        invalidPassword: false,
      });
    }

    const authResponse = await api<AuthResponse, LoginBody>({
      endpoint: '/auth/login',
      method: 'POST',
      body: {
        email, password,
      },
    });

    if (authResponse.status) {
      localStorage.setItem('access_token', (authResponse as AuthResponse).access_token);
      localStorage.setItem('refresh_token', (authResponse as AuthResponse).refresh_token);

      if (serverError) {
        this.setState({
          serverError: false,
        });
      }
      history.push('/');
    } else {
      this.setState({
        serverError: true,
      });
    }

    return null;
  }

  onEmailChange(ev: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: ev.target.value });
  }

  onPasswordChange(ev: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: ev.target.value });
  }

  render(): JSX.Element {
    const { invalidEmail, invalidPassword, serverError } = this.state;

    return (
      <Card>
        <TextField className="login__email" id="email" placeholder="Email" invalid={invalidEmail} errorText="Ivalid email format" onChange={(ev) => this.onEmailChange(ev)} />
        <TextField className="login__password" type="password" id="password" placeholder="Password" invalid={invalidPassword} errorText="Password is too weak" onChange={(ev) => this.onPasswordChange(ev)} />
        <Button className="login__button" onClick={() => this.onLoginButtonClick()}>Login</Button>
        <ErrorLabel className="login__error-label" invalid={serverError}>Login Problem: invalid email or password</ErrorLabel>
        <p>
          <Link to="/register">Register </Link>
          if you don&apos;t have an account yet.
        </p>
      </Card>
    );
  }
}
export default Login;
