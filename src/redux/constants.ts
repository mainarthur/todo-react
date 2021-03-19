export enum AppAction {
  REQUEST_USER = 'REQUEST_USER',
  SET_USER = 'SET_USER',
}

export enum ToDoAction {
  REQUEST_TODOS = 'REQUEST_TODOS',
  REQUEST_NEW_TODO = 'REQUEST_NEW_TODO',
  REQUEST_DELETE_MANY_TODOS = 'REQUEST_DELETE_MANY_TODOS',
  REQUEST_DELETE_TODO = 'REQUEST_DELETE_TODO',
  REQUEST_UPDATE_TODO = 'REQUEST_UPDATE_TODO',
  SET_LOADING_PART = 'SET_LOADING_PART',
  SET_TODOS = 'SET_TODOS',
  ADD_TODO = 'ADD_TODO',
}

export enum BoardAction {
  REQUEST_BOARDS = 'REQUEST_BOARDS',
  SET_BOARDS = 'SET_BOARDS',
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
