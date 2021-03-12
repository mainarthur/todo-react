import { all } from 'redux-saga/effects'
import watchAuth from './auth'
import watchTodos from './todo'
import watchUser from './user'

export default function* rootSaga() {
  yield all([
    watchTodos(),
    watchAuth(),
    watchUser(),
  ])
}
