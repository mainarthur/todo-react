import { createStore, applyMiddleware, StoreEnhancer } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers'

import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const compose = process.env.NODE_ENV === 'production' ? (a: StoreEnhancer<{
  dispatch: unknown
}, {}>) => a : composeWithDevTools

const store = createStore(
  rootReducer,
  compose(applyMiddleware(sagaMiddleware)),
)

sagaMiddleware.run(rootSaga)

export default store
