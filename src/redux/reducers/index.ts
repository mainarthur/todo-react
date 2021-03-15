import { combineReducers } from 'redux'

import appReducer from './appReducer'
import authReducer from './authReducer'
import newToDoReducer from './newToDoReducer'
import routerReducer from './routerReducer'
import todosReducer from './todosReducer'
import tokensReducer from './tokensReducer'

const rootReducer = combineReducers({
  tokens: tokensReducer,
  app: appReducer,
  router: routerReducer,
  todos: todosReducer,
  auth: authReducer,
  newToDo: newToDoReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
