import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
import newToDoReducer from './newToDoReducer';
import textFieldReducer from './textFieldReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  newToDo: newToDoReducer,
  textFields: textFieldReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
