import { TextFieldAction } from '../constants';
import TextFieldActions from '../types/textFieldTypes';

interface TextField {
  id: string;
  animation: string;
}

export interface TextFieldState {
  textFields: TextField[];
}

const initialState: TextFieldState = {
  textFields: [],
};

export default function textFieldReducer(state = initialState, action: TextFieldActions) {
  const newState = { ...state };
  let index;
  switch (action.type) {
    case TextFieldAction.ADD_TEXTFIELD:
      newState.textFields.push({
        id: action.payload,
        animation: '',
      });

      return newState;
    case TextFieldAction.SET_ANIMATION:
      index = newState.textFields.findIndex((e) => e.id === action.payload.id);
      newState.textFields[index].animation = action.payload.animation;
      return newState;
    default:
      return newState;
  }
}
