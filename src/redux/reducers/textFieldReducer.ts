import { TextFieldAction } from '../constants';
import TextFieldActions from '../types/textFieldTypes';

export interface TextFieldState {
  [key: string]: {
    animation: string;
  };
}

const initialState: TextFieldState = {};

export default function newToDoReducer(state = initialState, action: TextFieldActions) {
  const newState = { ...state };
  switch (action.type) {
    case TextFieldAction.ADD_TEXTFIELD:
      newState[action.payload] = {
        animation: '',
      };

      return newState;
    case TextFieldAction.SET_ANIMATION:
      newState[action.payload.id] = {
        animation: action.payload.animation,
      };

      return newState;
    default:
      return newState;
  }
}
