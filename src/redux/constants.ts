export enum AppAction {
  SET_USER = 'SET_USER',
  FETCH_USER = 'FETCH_USER',
}

export enum ToDoAction {
  SET_TODOS = 'SET_TODOS',
  ADD_TODO = 'ADD_TODO',
}

export enum RouterAction {
  SET_ROUTE = 'SET_ROUTE',
}

export enum TokenAction {
  SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN',
  SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN',
  DELETE_TOKENS = 'DELETE_TOKENS',
}

export enum AuthAction {
  REQUESTED_AUTH = 'REQUESTED_AUTH',
  REQUESTED_AUTH_SUCCEEDED = 'REQUESTED_AUTH_SUCCEEDED',
  REQUESTED_AUTH_FAILED = 'REQUESTED_AUTH_FAILED',
  CLEAR_STATE = 'CLEAR_STATE',
}

export enum AuthTypes {
  LOGIN = 'LOGIN',
  REGISTRATION = 'REGISTRATION',
}
