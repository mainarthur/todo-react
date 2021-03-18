import { combineReducers } from 'redux'

import appReducer from './appReducer'
import routerReducer from './routerReducer'
import tokensReducer from './tokensReducer'

const rootReducer = combineReducers({
  tokens: tokensReducer,
  app: appReducer,
  router: routerReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
