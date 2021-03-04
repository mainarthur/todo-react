import { TextFieldAction } from '../constants';

export interface AddTextFieldAction {
  type: TextFieldAction.ADD_TEXTFIELD;
  payload: string;
}

export interface ToggleAnimationAction {
  type: TextFieldAction.TOGGLE_ANIMATION;
}

type TextFieldActions = AddTextFieldAction | ToggleAnimationAction;

export default TextFieldActions;
