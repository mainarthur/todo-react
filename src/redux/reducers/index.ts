import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
import newToDoReducer from './newToDoReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  newToDo: newToDoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
