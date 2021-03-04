import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
