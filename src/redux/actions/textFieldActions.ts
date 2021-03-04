import { TextFieldAction } from '../constants';
import { AddTextFieldAction, SetAnimationAction } from '../types/textFieldTypes';

export const addTextFieldAction = (id: string): AddTextFieldAction => ({
  type: TextFieldAction.ADD_TEXTFIELD,
  payload: id,
});

export const setAnimationAction = (id: string, animation: string): SetAnimationAction => ({
  type: TextFieldAction.SET_ANIMATION,
  payload: {
    id,
    animation,
  },
});
