import { NewToDoAction } from '../constants'

export interface ChangeNewToDoTextAction {
  type: NewToDoAction.CHANGE_TEXT
  payload: string
}

export interface ToggleTextErrorAction {
  type: NewToDoAction.TOGGLE_TEXT_ERROR
}

type NewToDoActions = ChangeNewToDoTextAction | ToggleTextErrorAction

export default NewToDoActions
