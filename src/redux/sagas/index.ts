import { all } from 'redux-saga/effects'
import watchAuth from './auth'
import watchBoards from './boards'
import watchTodos from './todo'
import watchUser from './user'

export default function* rootSaga() {
  yield all([
    watchTodos(),
    watchAuth(),
    watchUser(),
    watchBoards(),
  ])
}
