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

export enum TextFieldAction {
  ADD_TEXTFIELD = 'TextFieldAction.ADD_TEXTFIELD',
  SET_ANIMATION = 'TextFieldAction.SET_ANIMATION',
}

export enum AppAction {
  SET_USER = 'AppAction.SET_USER',
  SET_TODOS = 'AppAction.SET_TODOS',
  ADD_TODO = 'AppAction.ADD_TODO',
  UPDATE_TODO_POSITION = 'AppAction.UPDATE_TODO_POSITION',
  UPDATE_TODO_STATUS = 'AppAction.UPDATE_TODO_STATUS',
  DELETE_TODO = 'AppAction.DELETE_TODO',
}

export enum RouterAction {
  SET_ROUTE = 'RouterAction.SET_ROUTE',
}
