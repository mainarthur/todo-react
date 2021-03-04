import * as React from 'react';
import { connect } from 'react-redux';
import { api } from '../api/api';
import RegisterBody from '../api/bodies/RegisterBody';
import AuthResponse from '../api/responses/AuthResponse';
import Button from '../common/Button';
import Card from '../common/Card';
import ErrorLabel from '../common/ErrorLabel';
import TextField from '../common/TextField';
import {
  changeEmailAction,
  changeNameAction,
  changePasswordAction,
  toggleEmailValidationAction,
  toggleNameValidationAction,
  togglePasswordValidationAction,
  toggleServerErrorAction,
} from '../redux/actions/authActions';
import { AuthMethod } from '../redux/constants';
import { RootState } from '../redux/reducers';
import { RegisterState } from '../redux/reducers/registerReducer';
import Link from '../routing/Link';
import { history } from '../routing/RouterContext';
import { isValidEmail, isValidName, isValidPassword } from '../utils';
import './Register.scss';

interface DispatchProps {
  changeEmail: typeof changeEmailAction;
  changePassword: typeof changePasswordAction;
  changeName: typeof changeNameAction;
  toggleEmailValidation: typeof toggleEmailValidationAction;
  togglePasswordValidation: typeof togglePasswordValidationAction;
  toggleNameValidation: typeof toggleNameValidationAction;
  toggleSeverError: typeof toggleServerErrorAction;
}

type Props = RegisterState & DispatchProps;

class Register extends React.Component<Props> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    if (localStorage.getItem('access_token')) {
      history.push('/');
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
    } = this.props;

    const email = stateEmail.trim();
    const name = stateName.trim();
    const password = statePassword.trim();

    if (!isValidEmail(email)) {
      if (!invalidEmail) {
        toggleEmailValidation(AuthMethod.REGISTRATION);
      }
      return;
    } if (invalidEmail) {
      toggleEmailValidation(AuthMethod.REGISTRATION);
    }

    if (!isValidName(name)) {
      if (!invalidName) {
        toggleNameValidation(AuthMethod.REGISTRATION);
      }
      return;
    } if (invalidName) {
      toggleNameValidation(AuthMethod.REGISTRATION);
    }

    if (!isValidPassword(password)) {
      if (!invalidPassword) {
        togglePasswordValidation(AuthMethod.REGISTRATION);
      }
      return;
    } if (invalidPassword) {
      togglePasswordValidation(AuthMethod.REGISTRATION);
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
        toggleSeverError(AuthMethod.REGISTRATION);
      }
    } else if (serverError) {
      toggleSeverError(AuthMethod.REGISTRATION);
    }
  };

  onEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { changeEmail } = this.props;

    changeEmail(ev.target.value, AuthMethod.REGISTRATION);
  };

  onPasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { changePassword } = this.props;

    changePassword(ev.target.value, AuthMethod.REGISTRATION);
  };

  onNameChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    const { changeName } = this.props;

    changeName(ev.target.value, AuthMethod.REGISTRATION);
  };

  render(): JSX.Element {
    const {
      invalidEmail, invalidName, invalidPassword, serverError,
    } = this.props;

    return (
      <Card>
        <TextField
          className="register__email"
          id="email"
          placeholder="Email"
          invalid={invalidEmail}
          errorText="Ivalid email format"
          onChange={this.onEmailChange}
        />
        <TextField
          className="register__name"
          id="name"
          placeholder="Name"
          invalid={invalidName}
          errorText="Ivalid name format"
          onChange={this.onNameChange}
        />
        <TextField
          className="register__password"
          type="password"
          id="password"
          placeholder="Password"
          invalid={invalidPassword}
          errorText="Password is too weak"
          onChange={this.onPasswordChange}
        />
        <Button
          className="register__button"
          onClick={this.onRegisterButtonClick}
        >
          Register
        </Button>
        <ErrorLabel
          className="register__error-label"
          invalid={serverError}
        >
          Register Problem: try to use another email
        </ErrorLabel>
        <p>
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </Card>
    );
  }
}
const mapStateToProps = (state: RootState): RegisterState => ({ ...state.register });

const mapDispatchToProps: DispatchProps = {
  changeEmail: changeEmailAction,
  changePassword: changePasswordAction,
  changeName: changeNameAction,
  toggleEmailValidation: toggleEmailValidationAction,
  togglePasswordValidation: togglePasswordValidationAction,
  toggleSeverError: toggleServerErrorAction,
  toggleNameValidation: toggleNameValidationAction,
};

export default connect<RegisterState, DispatchProps>(mapStateToProps, mapDispatchToProps)(Register);
