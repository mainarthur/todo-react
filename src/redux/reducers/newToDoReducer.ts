import { NewToDoAction } from '../constants';
import NewToDoActions from '../types/newToDoTypes';

export type NewToDoState = {
  textFieldValue: string;
  invalidText: boolean;
};

const initialState: NewToDoState = {
  textFieldValue: '',
  invalidText: false,
};

export default function newToDoReducer(state = initialState, action: NewToDoActions) {
  const newState = { ...state };
  switch (action.type) {
    case NewToDoAction.CHANGE_TEXT:
      newState.textFieldValue = action.payload;

      return newState;
    case NewToDoAction.TOGGLE_TEXT_ERROR:
      newState.invalidText = !newState.invalidText;

      return newState;
    default:
      return newState;
  }
}
