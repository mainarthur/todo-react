import { combineReducers } from 'redux'

import appReducer from './appReducer'
import boardsReducer from './boardsReducer'
import routerReducer from './routerReducer'
import tokensReducer from './tokensReducer'

const rootReducer = combineReducers({
  tokens: tokensReducer,
  app: appReducer,
  router: routerReducer,
  boards: boardsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
