import { TextFieldAction } from '../constants';
import { AddTextFieldAction, ToggleAnimationAction } from '../types/textFieldTypes';

export const ddTextFieldAction = (id: string): AddTextFieldAction => ({
  type: TextFieldAction.ADD_TEXTFIELD,
  payload: id,
});

export const toggleAnimationAction = (): ToggleAnimationAction => ({
  type: TextFieldAction.TOGGLE_ANIMATION,
});
