import * as React from 'react';
import { api } from '../api/api';
import RegisterBody from '../api/bodies/RegisterBody';
import AuthResponse from '../api/responses/AuthResponse';
import Button from '../common/Button';
import Card from '../common/Card';
import ErrorLabel from '../common/ErrorLabel';
import TextField from '../common/TextField';
import Link from '../routing/Link';
import { history } from '../routing/RouterContext';
import { isValidEmail, isValidName, isValidPassword } from '../utils';
import './Register.scss';

type RegisterState = {
  email: string
  password: string
  name: string
  invalidEmail: boolean
  invalidName: boolean
  invalidPassword: boolean
  serverError: boolean
};

class Register extends React.Component<{}, RegisterState> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    if (localStorage.getItem('access_token')) {
      history.push('/');
    }

    this.state = {
      email: '',
      password: '',
      name: '',
      invalidName: false,
      invalidEmail: false,
      invalidPassword: false,
      serverError: false,
    };
  }

  async onRegisterButtonClick(): Promise<void> {
    let {
      email, password, name,
    } = this.state;

    const {
      invalidName, invalidEmail, invalidPassword, serverError,
    } = this.state;

    email = email.trim();
    name = name.trim();
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

    if (!isValidName(name)) {
      return this.setState({
        invalidName: true,
      });
    } if (invalidName) {
      this.setState({
        invalidName: false,
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

    const authResponse = await api<AuthResponse, RegisterBody>({
      endpoint: '/auth/register',
      method: 'POST',
      body: {
        email, password, name,
      },
    });

    if (authResponse.status) {
      localStorage.setItem('access_token', (authResponse as AuthResponse).access_token);
      localStorage.setItem('refresh_token', (authResponse as AuthResponse).refresh_token);

      history.push('/');
      if (serverError) {
        this.setState({
          serverError: false,
        });
      }
    } else {
      this.setState({
        serverError: true,
      });
    }

    return null;
  }

  onPasswordChange(ev: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      password: ev.target.value,
    });
  }

  onNameChange(ev: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      name: ev.target.value,
    });
  }

  onEmailChange(ev: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      email: ev.target.value,
    });
  }

  render(): JSX.Element {
    const {
      invalidEmail, invalidName, invalidPassword, serverError,
    } = this.state;

    return (
      <Card>
        <TextField className="register__email" id="email" placeholder="Email" invalid={invalidEmail} errorText="Ivalid email format" onChange={(ev) => this.onEmailChange(ev)} />
        <TextField className="register__name" id="name" placeholder="Name" invalid={invalidName} errorText="Ivalid name format" onChange={(ev) => this.onNameChange(ev)} />
        <TextField className="register__password" type="password" id="password" placeholder="Password" invalid={invalidPassword} errorText="Password is too weak" onChange={(ev) => this.onPasswordChange(ev)} />
        <Button className="register__button" onClick={() => this.onRegisterButtonClick()}>Register</Button>
        <ErrorLabel className="register__error-label" invalid={serverError}>Register Problem: try to use another email</ErrorLabel>
        <p>
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </Card>
    );
  }
}
export default Register;
