export enum AppAction {
  REQUESTED_USER = 'REQUESTED_USER',
  REQUESTED_USER_SUCCEEDED = 'REQUESTED_USER_SUCCEEDED',
  REQUESTED_USER_FAILED = 'REQUESTED_USER_FAILED',
  SET_USER = 'SET_USER',
  FETCH_USER = 'FETCH_USER',
}

export enum ToDoAction {
  REQUESTED_NEW_TODO = 'REQUESTED_NEW_TODO',
  REQUESTED_NEW_TODO_SUCCEEDED = 'REQUESTED_NEW_TODO_SUCCEEDED',
  REQUESTED_NEW_TODO_FAILED = 'REQUESTED_NEW_TODO_FAILED',
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
