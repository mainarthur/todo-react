export enum AppAction {
  REQUEST_USER = 'REQUEST_USER',
  SET_USER = 'SET_USER',
  FETCH_USER = 'FETCH_USER',
}

export enum ToDoAction {
  REQUEST_NEW_TODO = 'REQUEST_NEW_TODO',
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
  REQUESTED_LOGIN = 'REQUESTED_LOGIN',
  REQUESTED_REGISTER = 'REQUESTED_REGISTER',
}

export enum RequestStatus {
  OK,
  ERROR,
  NONE,
}
