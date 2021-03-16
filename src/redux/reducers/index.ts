import { combineReducers } from 'redux'

import appReducer from './appReducer'
import authReducer from './authReducer'
import routerReducer from './routerReducer'
import todosReducer from './todosReducer'
import tokensReducer from './tokensReducer'

const rootReducer = combineReducers({
  tokens: tokensReducer,
  app: appReducer,
  router: routerReducer,
  todos: todosReducer,
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
