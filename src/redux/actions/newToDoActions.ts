import { NewToDoAction } from '../constants';
import { ChangeNewToDoTextAction, ToggleTextErrorAction } from '../types/newToDoTypes';

export const changeNewToDoTextAction = (text: string): ChangeNewToDoTextAction => ({
  type: NewToDoAction.CHANGE_TEXT,
  payload: text,
});

export const toggleTextErrorAction = (): ToggleTextErrorAction => ({
  type: NewToDoAction.TOGGLE_TEXT_ERROR,
});
