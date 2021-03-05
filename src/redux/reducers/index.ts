import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import registerReducer from './registerReducer'
import newToDoReducer from './newToDoReducer'
import textFieldReducer from './textFieldReducer'
import appReducer from './appReducer'
import routerReducer from './routerReducer'
import todosReducer from './todosReducer'

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  newToDo: newToDoReducer,
  textFields: textFieldReducer,
  app: appReducer,
  router: routerReducer,
  todos: todosReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
