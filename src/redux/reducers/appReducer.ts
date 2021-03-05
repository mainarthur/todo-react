import ToDo from '../../models/ToDo';
import User from '../../models/User';
import { AppAction } from '../constants';
import AppActions from '../types/appTypes';

export type AppState = {
  todos: ToDo[];
  user: User;
};

const initialState: AppState = {
  user: null,
  todos: [],
};

export default function appReducer(state = initialState, action: AppActions): AppState {
  const newState = { ...state };
  switch (action.type) {
    case AppAction.ADD_TODO:
      newState.todos = newState.todos.concat([{ ...action.payload }]);

      return newState;
    case AppAction.SET_TODOS:
      newState.todos = [...action.payload];

      return newState;
    case AppAction.SET_USER:
      newState.user = { ...action.payload };

      return newState;
    default:
      return state;
  }
}
