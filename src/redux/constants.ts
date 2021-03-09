export enum AuthAction {
  CHANGE_EMAIL = 'AuthAction.CHANGE_EMAIL',
  CHANGE_PASSWORD = 'AuthAction.CHANGE_PASSWORD',
  CHANGE_NAME = 'AuthAction.CHANGE_NAME',
  TOGGLE_SERVER_ERROR = 'AuthAction.TOGGLE_SERVER_ERROR',
  TOGGLE_EMAIL_VALIDATION = 'AuthAction.TOGGLE_EMAIL_VALIDATION',
  TOGGLE_PASSWORD_VALIDATION = 'AuthAction.TOGGLE_PASSWORD_VALIDATION',
  TOGGLE_NAME_VALIDATION = 'AuthAction.TOGGLE_NAME_VALIDATION',
}

export enum AuthMethod {
  LOGIN = 'AuthMethod.LOGIN',
  REGISTRATION = 'AuthMethod.REGISTRATION',
}

export enum NewToDoAction {
  CHANGE_TEXT = 'NewToDoAction.CHANGE_TEXT',
  TOGGLE_TEXT_ERROR = 'NewToDoAction.TOGGLE_TEXT_ERROR',
}

export enum AppAction {
  SET_USER = 'AppAction.SET_USER',
}

export enum ToDoAction {
  SET_TODOS = 'ToDoAction.SET_TODOS',
  ADD_TODO = 'ToDoAction.ADD_TODO',
}

export enum RouterAction {
  SET_ROUTE = 'RouterAction.SET_ROUTE',
}

export enum TokenAction {
  SET_REFRESH_TOKEN = 'TokenAction.SET_REFRESH_TOKEN',
  SET_ACCESS_TOKEN = 'TokenAction.SET_ACCESS_TOKEN',
  DELETE_TOKENS = 'TokenAction.DELETE_TOKENS',
}
