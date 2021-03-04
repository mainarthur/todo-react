import { Actions, AuthMethod } from '../constants';
import AuthActions from '../types/authTypes';

type LoginState = {
  email: string;
  password: string;
  invalidEmail: boolean;
  invalidPassword: boolean;
  serverError: boolean;
};

const initialState: LoginState = {
  email: '',
  password: '',
  invalidEmail: false,
  invalidPassword: false,
  serverError: false,
};

export default function loginReducer(state = initialState, action: AuthActions): LoginState {
  if (action.method === AuthMethod.LOGIN) {
    const newState = { ...state };
    switch (action.type) {
      case Actions.CHANGE_EMAIL:
        newState.email = action.payload;

        return newState;
      case Actions.CHANGE_PASSWORD:
        newState.password = action.payload;

        return newState;
      case Actions.TOGGLE_EMAIL_VALIDATION:
        newState.invalidEmail = !newState.invalidEmail;

        return newState;
      case Actions.TOGGLE_PASSWORD_VALIDATION:
        newState.invalidPassword = !newState.invalidPassword;

        return newState;
      case Actions.TOGGLE_SERVER_ERROR:
        newState.serverError = !newState.serverError;

        return newState;
      default:
        return state;
    }
  } else {
    return state;
  }
}
