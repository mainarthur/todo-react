import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import registerReducer from './registerReducer'
import newToDoReducer from './newToDoReducer'
import appReducer from './appReducer'
import routerReducer from './routerReducer'
import todosReducer from './todosReducer'
import tokensReducer from './tokensReducer'

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  newToDo: newToDoReducer,
  tokens: tokensReducer,
  app: appReducer,
  router: routerReducer,
  todos: todosReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
